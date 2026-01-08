import './InventoryStatus.css'

function InventoryStatus({ inventory, onUpdateInventory }) {
  const getInventoryStatus = (quantity) => {
    if (quantity === 0) {
      return { text: '없어요', className: 'status-none' }
    } else if (quantity < 5) {
      return { text: '부족해요', className: 'status-low' }
    } else {
      return { text: '여유있어요', className: 'status-ok' }
    }
  }

  const handleIncrease = (menuId) => {
    onUpdateInventory(menuId, 1)
  }

  const handleDecrease = (menuId) => {
    const currentItem = inventory.find(item => item.id === menuId)
    if (currentItem && currentItem.quantity > 0) {
      onUpdateInventory(menuId, -1)
    }
  }

  return (
    <div className="inventory-status">
      <h2 className="inventory-title">재고 현황</h2>
      {inventory.length === 0 ? (
        <p style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
          재고 데이터를 불러오는 중...
        </p>
      ) : (
        <div className="inventory-grid">
          {inventory.map(item => {
            const quantity = item.quantity !== undefined && item.quantity !== null ? item.quantity : 0
            const status = getInventoryStatus(quantity)
            return (
              <div key={item.id} className="inventory-card">
                <h3 className="inventory-menu-name">{item.name}</h3>
                <div className="inventory-quantity">
                  <span className="quantity-value">{quantity}개</span>
                  <span className={`status-badge ${status.className}`}>
                    {status.text}
                  </span>
                </div>
                <div className="inventory-controls">
                  <button
                    className="inventory-button decrease"
                    onClick={() => handleDecrease(item.id)}
                    disabled={quantity === 0}
                  >
                    -
                  </button>
                  <button
                    className="inventory-button increase"
                    onClick={() => handleIncrease(item.id)}
                  >
                    +
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default InventoryStatus

