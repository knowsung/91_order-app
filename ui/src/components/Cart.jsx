import './Cart.css'

function Cart({ cartItems, onUpdateQuantity, onRemoveItem, onOrder }) {
  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.finalPrice * item.quantity, 0)
  }

  const formatPrice = (price) => {
    return price.toLocaleString('ko-KR')
  }

  const getItemDisplayName = (item) => {
    if (item.options.length > 0) {
      return `${item.menuName} (${item.options.join(', ')})`
    }
    return item.menuName
  }

  const handleOrder = () => {
    if (cartItems.length === 0) return
    onOrder()
  }

  return (
    <div className="cart">
      <h2 className="cart-title">장바구니</h2>
      {cartItems.length === 0 ? (
        <p className="cart-empty">장바구니가 비어있습니다.</p>
      ) : (
        <div className="cart-content">
          <div className="cart-items-section">
            <div className="cart-items">
              {cartItems.map((item, index) => (
                <div key={`${item.menuId}-${item.options.join('-')}-${index}`} className="cart-item">
                  <div className="cart-item-info">
                    <span className="cart-item-name">
                      {getItemDisplayName(item)} X {item.quantity}
                    </span>
                    <span className="cart-item-price">
                      {formatPrice(item.finalPrice * item.quantity)}원
                    </span>
                  </div>
                  <div className="cart-item-controls">
                    <button
                      className="quantity-button"
                      onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button
                      className="quantity-button"
                      onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                    >
                      +
                    </button>
                    <button
                      className="remove-button"
                      onClick={() => onRemoveItem(index)}
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="cart-summary-section">
            <div className="cart-total">
              <span className="total-label">총 금액</span>
              <span className="total-amount">{formatPrice(calculateTotal())}원</span>
            </div>
            <button
              className="order-button"
              onClick={handleOrder}
              disabled={cartItems.length === 0}
            >
              주문하기
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart

