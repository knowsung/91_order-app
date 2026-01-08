import pool from '../config/database.js'

// 주문 생성
export const createOrder = async (req, res) => {
  const dbClient = await pool.connect()

  try {
    await dbClient.query('BEGIN')

      const { items, total_amount } = req.body

      // 입력 검증
      if (!items || !Array.isArray(items) || items.length === 0) {
        throw new Error('주문 아이템이 필요합니다.')
      }

      if (!total_amount || total_amount <= 0) {
        throw new Error('유효한 총 금액이 필요합니다.')
      }

      // 재고 확인 및 차감
      for (const item of items) {
        const menuResult = await dbClient.query(
          'SELECT stock_quantity FROM menus WHERE id = $1',
          [item.menu_id]
        )

        if (menuResult.rows.length === 0) {
          throw new Error(`메뉴 ID ${item.menu_id}를 찾을 수 없습니다.`)
        }

        const currentStock = menuResult.rows[0].stock_quantity
        if (currentStock < item.quantity) {
          throw new Error(`메뉴 ID ${item.menu_id}의 재고가 부족합니다. (현재: ${currentStock}, 요청: ${item.quantity})`)
        }

        // 재고 차감
        await dbClient.query(
          'UPDATE menus SET stock_quantity = stock_quantity - $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
          [item.quantity, item.menu_id]
        )
      }

      // 주문 생성
      const orderResult = await dbClient.query(
        'INSERT INTO orders (total_amount, status) VALUES ($1, $2) RETURNING id, order_date, status, total_amount',
        [total_amount, '주문 접수']
      )

      const orderId = orderResult.rows[0].id

      // 주문 아이템 저장
      for (const item of items) {
        const orderItemResult = await dbClient.query(
          'INSERT INTO order_items (order_id, menu_id, quantity, unit_price, total_price) VALUES ($1, $2, $3, $4, $5) RETURNING id',
          [orderId, item.menu_id, item.quantity, item.unit_price, item.total_price]
        )

        const orderItemId = orderItemResult.rows[0].id

        // 옵션 저장
        if (item.option_ids && item.option_ids.length > 0) {
          for (const optionId of item.option_ids) {
            await dbClient.query(
              'INSERT INTO order_item_options (order_item_id, option_id) VALUES ($1, $2)',
              [orderItemId, optionId]
            )
          }
        }
      }

    await dbClient.query('COMMIT')

    res.json({
      success: true,
      data: {
        order_id: orderId,
        order_date: orderResult.rows[0].order_date,
        status: orderResult.rows[0].status,
        total_amount: orderResult.rows[0].total_amount
      }
    })
  } catch (error) {
    await dbClient.query('ROLLBACK')
    console.error('주문 생성 오류:', error)
    res.status(400).json({
      success: false,
      error: error.message || '주문 생성 중 오류가 발생했습니다.'
    })
  } finally {
    dbClient.release()
  }
}

// 주문 목록 조회
export const getOrders = async (req, res) => {
  try {
    const { status } = req.query
    let query = `
      SELECT 
        o.id,
        o.order_date,
        o.status,
        o.total_amount,
        COALESCE(
          json_agg(
            json_build_object(
              'menu_name', m.name,
              'quantity', oi.quantity,
              'options', COALESCE(
                (
                  SELECT json_agg(opt.name)
                  FROM order_item_options oio2
                  JOIN options opt ON oio2.option_id = opt.id
                  WHERE oio2.order_item_id = oi.id
                ),
                '[]'::json
              ),
              'total_price', oi.total_price
            )
          ) FILTER (WHERE oi.id IS NOT NULL),
          '[]'::json
        ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN menus m ON oi.menu_id = m.id
    `

    const params = []
    if (status) {
      query += ' WHERE o.status = $1'
      params.push(status)
    }

    query += ' GROUP BY o.id, o.order_date, o.status, o.total_amount'
    query += ' ORDER BY o.order_date DESC'

    const result = await pool.query(query, params)

    res.json({
      success: true,
      data: result.rows,
      total: result.rows.length
    })
  } catch (error) {
    console.error('주문 목록 조회 오류:', error)
    res.status(500).json({
      success: false,
      error: '주문 목록 조회 중 오류가 발생했습니다.',
      message: error.message
    })
  }
}

// 주문 정보 조회
export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params

    const orderQuery = `
      SELECT 
        o.id,
        o.order_date,
        o.status,
        o.total_amount,
        COALESCE(
          json_agg(
            json_build_object(
              'id', oi.id,
              'menu_id', oi.menu_id,
              'menu_name', m.name,
              'quantity', oi.quantity,
              'unit_price', oi.unit_price,
              'total_price', oi.total_price,
              'options', COALESCE(
                (
                  SELECT json_agg(
                    json_build_object(
                      'id', opt.id,
                      'name', opt.name,
                      'price', opt.price
                    )
                  )
                  FROM order_item_options oio2
                  JOIN options opt ON oio2.option_id = opt.id
                  WHERE oio2.order_item_id = oi.id
                ),
                '[]'::json
              )
            )
          ) FILTER (WHERE oi.id IS NOT NULL),
          '[]'::json
        ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN menus m ON oi.menu_id = m.id
      WHERE o.id = $1
      GROUP BY o.id, o.order_date, o.status, o.total_amount
    `

    const result = await pool.query(orderQuery, [orderId])

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: '주문을 찾을 수 없습니다.'
      })
    }

    res.json({
      success: true,
      data: result.rows[0]
    })
  } catch (error) {
    console.error('주문 정보 조회 오류:', error)
    res.status(500).json({
      success: false,
      error: '주문 정보 조회 중 오류가 발생했습니다.',
      message: error.message
    })
  }
}

// 주문 상태 변경
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params
    const { status } = req.body

    const validStatuses = ['주문 접수', '제조 중', '제조 완료']
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `유효한 상태를 입력하세요. (${validStatuses.join(', ')})`
      })
    }

    const result = await pool.query(
      'UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, status, updated_at',
      [status, orderId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: '주문을 찾을 수 없습니다.'
      })
    }

    res.json({
      success: true,
      data: result.rows[0]
    })
  } catch (error) {
    console.error('주문 상태 변경 오류:', error)
    res.status(500).json({
      success: false,
      error: '주문 상태 변경 중 오류가 발생했습니다.',
      message: error.message
    })
  }
}
