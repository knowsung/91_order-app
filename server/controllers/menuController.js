import pool from '../config/database.js'

// 메뉴 목록 조회
export const getMenus = async (req, res) => {
  try {
    // 메뉴와 옵션을 함께 조회
    const menusQuery = `
      SELECT 
        m.id,
        m.name,
        m.description,
        m.price,
        m.image_url,
        m.stock_quantity,
        COALESCE(
          json_agg(
            json_build_object(
              'id', o.id,
              'name', o.name,
              'price', o.price
            )
          ) FILTER (WHERE o.id IS NOT NULL),
          '[]'::json
        ) as options
      FROM menus m
      LEFT JOIN options o ON m.id = o.menu_id
      GROUP BY m.id, m.name, m.description, m.price, m.image_url, m.stock_quantity
      ORDER BY m.id
    `

    const result = await pool.query(menusQuery)
    
    res.json({
      success: true,
      data: result.rows
    })
  } catch (error) {
    console.error('메뉴 조회 오류:', error)
    res.status(500).json({
      success: false,
      error: '메뉴 조회 중 오류가 발생했습니다.',
      message: error.message
    })
  }
}

// 재고 수정
export const updateMenuStock = async (req, res) => {
  try {
    const { menuId } = req.params
    const { quantity } = req.body

    if (quantity === undefined || quantity < 0) {
      return res.status(400).json({
        success: false,
        error: '유효한 재고 수량을 입력하세요.'
      })
    }

    const result = await pool.query(
      'UPDATE menus SET stock_quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, name, stock_quantity',
      [quantity, menuId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: '메뉴를 찾을 수 없습니다.'
      })
    }

    res.json({
      success: true,
      data: result.rows[0]
    })
  } catch (error) {
    console.error('재고 수정 오류:', error)
    res.status(500).json({
      success: false,
      error: '재고 수정 중 오류가 발생했습니다.',
      message: error.message
    })
  }
}
