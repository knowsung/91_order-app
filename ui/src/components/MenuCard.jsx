import { useState } from 'react'
import './MenuCard.css'

function MenuCard({ menu, onAddToCart }) {
  const [selectedOptions, setSelectedOptions] = useState({
    extraShot: false,
    extraSyrup: false
  })

  const handleOptionChange = (option) => {
    setSelectedOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }))
  }

  const calculatePrice = () => {
    let total = menu.price
    if (selectedOptions.extraShot) total += 500
    if (selectedOptions.extraSyrup) total += 0
    return total
  }

  const handleAddToCart = () => {
    const options = []
    if (selectedOptions.extraShot) options.push('샷 추가')
    if (selectedOptions.extraSyrup) options.push('시럽 추가')
    
    onAddToCart({
      menuId: menu.id,
      menuName: menu.name,
      basePrice: menu.price,
      options: options,
      finalPrice: calculatePrice(),
      quantity: 1
    })

    // 옵션 초기화
    setSelectedOptions({
      extraShot: false,
      extraSyrup: false
    })
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
          <label className="option-label">
            <input
              type="checkbox"
              checked={selectedOptions.extraShot}
              onChange={() => handleOptionChange('extraShot')}
            />
            <span>샷 추가 (+500원)</span>
          </label>
          <label className="option-label">
            <input
              type="checkbox"
              checked={selectedOptions.extraSyrup}
              onChange={() => handleOptionChange('extraSyrup')}
            />
            <span>시럽 추가 (+0원)</span>
          </label>
        </div>
        <button className="add-to-cart-button" onClick={handleAddToCart}>
          담기
        </button>
      </div>
    </div>
  )
}

export default MenuCard

