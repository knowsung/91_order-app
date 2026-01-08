import './OrderStatus.css'

function OrderStatus({ orders, onUpdateOrderStatus }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hours = date.getHours()
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${month}월 ${day}일 ${hours}:${minutes}`
  }

  const formatPrice = (price) => {
    return price.toLocaleString('ko-KR')
  }

  const getOrderItemsText = (items) => {
    if (!items || !Array.isArray(items)) return '주문 내역 없음'
    
    return items.map(item => {
      // API 응답 형식에 맞게 처리
      const menuName = item.menu_name || item.menuName || '알 수 없음'
      const quantity = item.quantity || 0
      const options = item.options || []
      
      let optionsText = ''
      if (Array.isArray(options) && options.length > 0) {
        // 옵션이 문자열 배열인 경우
        if (typeof options[0] === 'string') {
          optionsText = ` (${options.join(', ')})`
        } else {
          // 옵션이 객체 배열인 경우
          optionsText = ` (${options.map(opt => opt.name || opt).join(', ')})`
        }
      }
      
      return `${menuName}${optionsText} x ${quantity}`
    }).join(', ')
  }

  const calculateOrderTotal = (items) => {
    if (!items || !Array.isArray(items)) return 0
    
    return items.reduce((sum, item) => {
      // API 응답 형식에 맞게 처리
      const totalPrice = item.total_price || item.totalPrice || 0
      return sum + totalPrice
    }, 0)
  }

  const handleStatusChange = (orderId, newStatus) => {
    onUpdateOrderStatus(orderId, newStatus)
  }

  const getStatusButton = (order) => {
    if (order.status === '주문 접수') {
      return (
        <button
          className="status-button start"
          onClick={() => handleStatusChange(order.id, '제조 중')}
        >
          제조 시작
        </button>
      )
    } else if (order.status === '제조 중') {
      return (
        <button
          className="status-button complete"
          onClick={() => handleStatusChange(order.id, '제조 완료')}
        >
          제조 완료
        </button>
      )
    }
    return null
  }

  return (
    <div className="order-status">
      <h2 className="order-title">주문 현황</h2>
      {orders.length === 0 ? (
        <p className="order-empty">주문이 없습니다.</p>
      ) : (
        <div className="order-list">
          {orders.map(order => (
            <div key={order.id} className="order-item">
              <div className="order-info">
                <div className="order-header">
                  <span className="order-date">{formatDate(order.date)}</span>
                  <span className={`order-status-badge ${order.status === '주문 접수' ? 'received' : order.status === '제조 중' ? 'in-progress' : 'completed'}`}>
                    {order.status}
                  </span>
                </div>
                <div className="order-details">
                  <span className="order-items">{getOrderItemsText(order.items)}</span>
                  <span className="order-price">
                    {formatPrice(order.total_amount || calculateOrderTotal(order.items))}원
                  </span>
                </div>
              </div>
              <div className="order-actions">
                {getStatusButton(order)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default OrderStatus

