import { useState } from 'react'
import './MenuCard.css'

function MenuCard({ menu, onAddToCart }) {
  // 옵션을 동적으로 관리
  const [selectedOptionIds, setSelectedOptionIds] = useState([])

  const handleOptionChange = (optionId) => {
    setSelectedOptionIds(prev => {
      if (prev.includes(optionId)) {
        return prev.filter(id => id !== optionId)
      } else {
        return [...prev, optionId]
      }
    })
  }

  const calculatePrice = () => {
    let total = menu.price
    const selectedOptions = menu.options?.filter(opt => selectedOptionIds.includes(opt.id)) || []
    selectedOptions.forEach(option => {
      total += option.price || 0
    })
    return total
  }

  const handleAddToCart = () => {
    const selectedOptions = menu.options?.filter(opt => selectedOptionIds.includes(opt.id)) || []
    const optionNames = selectedOptions.map(opt => opt.name)
    
    onAddToCart({
      menuId: menu.id,
      menuName: menu.name,
      basePrice: menu.price,
      options: optionNames,
      finalPrice: calculatePrice(),
      quantity: 1
    })

    // 옵션 초기화
    setSelectedOptionIds([])
  }

  const formatPrice = (price) => {
    return price.toLocaleString('ko-KR')
  }

  return (
    <div className="menu-card">
      <div className="menu-image">
        <div className="image-placeholder">☕</div>
      </div>
      <div className="menu-info">
        <h3 className="menu-name">{menu.name}</h3>
        <p className="menu-price">{formatPrice(calculatePrice())}원</p>
        <p className="menu-description">{menu.description}</p>
        <div className="menu-options">
          {menu.options && menu.options.length > 0 ? (
            menu.options.map(option => (
              <label key={option.id} className="option-label">
                <input
                  type="checkbox"
                  checked={selectedOptionIds.includes(option.id)}
                  onChange={() => handleOptionChange(option.id)}
                />
                <span>
                  {option.name} {option.price > 0 ? `(+${option.price.toLocaleString('ko-KR')}원)` : '(+0원)'}
                </span>
              </label>
            ))
          ) : (
            <p style={{ fontSize: '0.9rem', color: '#999' }}>옵션이 없습니다.</p>
          )}
        </div>
        <button className="add-to-cart-button" onClick={handleAddToCart}>
          담기
        </button>
      </div>
    </div>
  )
}

export default MenuCard

