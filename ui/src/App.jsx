import { useState, useEffect } from 'react'
import Header from './components/Header'
import MenuCard from './components/MenuCard'
import Cart from './components/Cart'
import AdminDashboard from './components/AdminDashboard'
import InventoryStatus from './components/InventoryStatus'
import OrderStatus from './components/OrderStatus'
import { menuAPI, orderAPI } from './services/api'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('order')
  const [menuData, setMenuData] = useState([])
  const [cartItems, setCartItems] = useState([])
  const [orders, setOrders] = useState([])
  const [inventory, setInventory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // 메뉴 데이터 로드
  useEffect(() => {
    loadMenus()
  }, [])

  // 주문 목록 로드 (관리자 화면)
  useEffect(() => {
    if (currentPage === 'admin') {
      loadOrders()
      loadInventory()
    }
  }, [currentPage])

  // 주문 목록 주기적 갱신 (관리자 화면)
  useEffect(() => {
    if (currentPage === 'admin') {
      const interval = setInterval(() => {
        loadOrders()
        loadInventory()
      }, 5000) // 5초마다 갱신

      return () => clearInterval(interval)
    }
  }, [currentPage])

  const loadMenus = async () => {
    try {
      setLoading(true)
      const menus = await menuAPI.getMenus()
      setMenuData(menus)
      setError(null)
    } catch (err) {
      console.error('메뉴 로드 오류:', err)
      setError('메뉴를 불러오는 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const loadOrders = async () => {
    try {
      const ordersData = await orderAPI.getOrders()
      // API 응답 형식에 맞게 변환
      const formattedOrders = ordersData.map(order => ({
        id: order.id,
        date: order.order_date,
        status: order.status,
        total_amount: order.total_amount,
        items: order.items || []
      }))
      setOrders(formattedOrders)
    } catch (err) {
      console.error('주문 목록 로드 오류:', err)
    }
  }

  const loadInventory = async () => {
    try {
      const menus = await menuAPI.getMenus()
      const inventoryData = menus.map(menu => ({
        id: menu.id,
        name: menu.name,
        quantity: menu.stock_quantity
      }))
      setInventory(inventoryData)
    } catch (err) {
      console.error('재고 로드 오류:', err)
    }
  }

  const handleNavigate = (page) => {
    setCurrentPage(page)
  }

  const handleAddToCart = (item) => {
    setCartItems(prev => {
      // 동일한 메뉴와 옵션 조합이 있는지 확인
      // toSorted()는 새 배열을 반환하므로 상태 변경을 일으키지 않음 (Node 20+ 또는 최신 브라우저 필요)
      // 호환성을 위해 [...array].sort() 사용
      const itemOptionsSorted = JSON.stringify([...item.options].sort())

      const existingIndex = prev.findIndex(
        cartItem =>
          cartItem.menuId === item.menuId &&
          JSON.stringify([...cartItem.options].sort()) === itemOptionsSorted
      )

      if (existingIndex !== -1) {
        // 기존 아이템 수량 증가 (불변성 유지)
        const updated = [...prev]
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1
        }
        return updated
      } else {
        // 새 아이템 추가
        return [...prev, item]
      }
    })
  }

  const handleUpdateQuantity = (index, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(index)
      return
    }
    setCartItems(prev => {
      const updated = [...prev]
      // 불변성 유지
      updated[index] = { ...updated[index], quantity: newQuantity }
      return updated
    })
  }

  const handleRemoveItem = (index) => {
    setCartItems(prev => prev.filter((_, i) => i !== index))
  }

  const handleOrder = async () => {
    if (cartItems.length === 0) return

    try {
      // API 형식에 맞게 변환
      const orderItems = cartItems.map(item => {
        // 옵션 이름을 옵션 ID로 변환
        const optionIds = []
        if (item.options && item.options.length > 0) {
          const menu = menuData.find(m => m.id === item.menuId)
          if (menu && menu.options) {
            item.options.forEach(optionName => {
              const option = menu.options.find(opt => opt.name === optionName)
              if (option) {
                optionIds.push(option.id)
              }
            })
          }
        }

        return {
          menu_id: item.menuId,
          quantity: item.quantity,
          option_ids: optionIds,
          unit_price: item.finalPrice,
          total_price: item.finalPrice * item.quantity
        }
      })

      const totalAmount = cartItems.reduce(
        (sum, item) => sum + item.finalPrice * item.quantity,
        0
      )

      // API 호출
      await orderAPI.createOrder({
        items: orderItems,
        total_amount: totalAmount
      })

      setCartItems([])
      alert('주문이 완료되었습니다!')

      // 관리자 화면이면 주문 목록 새로고침
      if (currentPage === 'admin') {
        loadOrders()
        loadInventory()
      }
    } catch (err) {
      console.error('주문 생성 오류:', err)
      alert(`주문 생성 실패: ${err.message}`)
    }
  }

  const handleUpdateInventory = async (menuId, change) => {
    try {
      const currentItem = inventory.find(item => item.id === menuId)
      if (!currentItem) return

      const newQuantity = Math.max(0, currentItem.quantity + change)

      // API 호출
      await menuAPI.updateStock(menuId, newQuantity)

      // 로컬 상태 업데이트
      setInventory(prev =>
        prev.map(item =>
          item.id === menuId
            ? { ...item, quantity: newQuantity }
            : item
        )
      )
    } catch (err) {
      console.error('재고 업데이트 오류:', err)
      alert(`재고 업데이트 실패: ${err.message}`)
    }
  }

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      // API 호출
      await orderAPI.updateOrderStatus(orderId, newStatus)

      // 로컬 상태 업데이트
      setOrders(prev =>
        prev.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      )
    } catch (err) {
      console.error('주문 상태 업데이트 오류:', err)
      alert(`주문 상태 업데이트 실패: ${err.message}`)
    }
  }

  // 대시보드 통계 계산
  const dashboardStats = {
    total: orders.length,
    received: orders.filter(o => o.status === '주문 접수').length,
    inProgress: orders.filter(o => o.status === '제조 중').length,
    completed: orders.filter(o => o.status === '제조 완료').length
  }

  return (
    <div className="app">
      <Header currentPage={currentPage} onNavigate={handleNavigate} />
      {currentPage === 'admin' ? (
        <div className="admin-page">
          <AdminDashboard stats={dashboardStats} />
          <div className="admin-content">
            <InventoryStatus
              inventory={inventory}
              onUpdateInventory={handleUpdateInventory}
            />
            <OrderStatus
              orders={orders}
              onUpdateOrderStatus={handleUpdateOrderStatus}
            />
          </div>
        </div>
      ) : (
        <div className="order-page">
          <div className="menu-section">
            <h2 className="section-title">메뉴</h2>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                메뉴를 불러오는 중...
              </div>
            ) : error ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
                {error}
                <br />
                <button onClick={loadMenus} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>
                  다시 시도
                </button>
              </div>
            ) : (
              <div className="menu-grid">
                {menuData.map(menu => (
                  <MenuCard
                    key={menu.id}
                    menu={menu}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="cart-section">
            <Cart
              cartItems={cartItems}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              onOrder={handleOrder}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default App
