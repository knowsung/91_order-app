import { useState } from 'react'
import Header from './components/Header'
import MenuCard from './components/MenuCard'
import Cart from './components/Cart'
import AdminDashboard from './components/AdminDashboard'
import InventoryStatus from './components/InventoryStatus'
import OrderStatus from './components/OrderStatus'
import './App.css'

// 임의의 커피 메뉴 데이터
const menuData = [
  {
    id: 1,
    name: '아메리카노(ICE)',
    price: 4000,
    description: '시원하고 깔끔한 아이스 아메리카노입니다.'
  },
  {
    id: 2,
    name: '아메리카노(HOT)',
    price: 4000,
    description: '따뜻하고 진한 핫 아메리카노입니다.'
  },
  {
    id: 3,
    name: '카페라떼',
    price: 5000,
    description: '부드러운 우유와 에스프레소의 조화입니다.'
  },
  {
    id: 4,
    name: '카푸치노',
    price: 5000,
    description: '우유 거품이 올라간 부드러운 카푸치노입니다.'
  },
  {
    id: 5,
    name: '카라멜 마키아토',
    price: 6000,
    description: '달콤한 카라멜과 에스프레소의 만남입니다.'
  },
  {
    id: 6,
    name: '바닐라 라떼',
    price: 5500,
    description: '바닐라 시럽이 들어간 부드러운 라떼입니다.'
  }
]

function App() {
  const [currentPage, setCurrentPage] = useState('order')
  const [cartItems, setCartItems] = useState([])
  const [orders, setOrders] = useState([])
  const [inventory, setInventory] = useState([
    { id: 1, name: '아메리카노(ICE)', quantity: 10 },
    { id: 2, name: '아메리카노(HOT)', quantity: 10 },
    { id: 3, name: '카페라떼', quantity: 10 }
  ])

  const handleNavigate = (page) => {
    setCurrentPage(page)
  }

  const handleAddToCart = (item) => {
    setCartItems(prev => {
      // 동일한 메뉴와 옵션 조합이 있는지 확인
      const existingIndex = prev.findIndex(
        cartItem =>
          cartItem.menuId === item.menuId &&
          JSON.stringify(cartItem.options.sort()) === JSON.stringify(item.options.sort())
      )

      if (existingIndex !== -1) {
        // 기존 아이템 수량 증가
        const updated = [...prev]
        updated[existingIndex].quantity += 1
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
      updated[index].quantity = newQuantity
      return updated
    })
  }

  const handleRemoveItem = (index) => {
    setCartItems(prev => prev.filter((_, i) => i !== index))
  }

  const handleOrder = () => {
    if (cartItems.length === 0) return

    // 주문 생성
    const newOrder = {
      id: Date.now(),
      date: new Date().toISOString(),
      items: cartItems.map(item => ({
        menuId: item.menuId,
        menuName: item.menuName,
        options: item.options,
        quantity: item.quantity,
        finalPrice: item.finalPrice
      })),
      status: '주문 접수'
    }

    setOrders(prev => [newOrder, ...prev])
    setCartItems([])
    alert('주문이 완료되었습니다!')
  }

  const handleUpdateInventory = (menuId, change) => {
    setInventory(prev =>
      prev.map(item =>
        item.id === menuId
          ? { ...item, quantity: Math.max(0, item.quantity + change) }
          : item
      )
    )
  }

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    )
  }

  // 대시보드 통계 계산
  const dashboardStats = {
    total: orders.length,
    received: orders.filter(o => o.status === '주문 접수').length,
    inProgress: orders.filter(o => o.status === '제조 중').length,
    completed: orders.filter(o => o.status === '제조 완료').length
  }

  if (currentPage === 'admin') {
    return (
      <div className="app">
        <Header currentPage={currentPage} onNavigate={handleNavigate} />
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
      </div>
    )
  }

  return (
    <div className="app">
      <Header currentPage={currentPage} onNavigate={handleNavigate} />
      <div className="order-page">
        <div className="menu-section">
          <h2 className="section-title">메뉴</h2>
          <div className="menu-grid">
            {menuData.map(menu => (
              <MenuCard
                key={menu.id}
                menu={menu}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
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
    </div>
  )
}

export default App
