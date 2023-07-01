export default class MatchGrid {
  constructor(size, number, time, theme) {
    this.size = size
    this.number = number
    this.time = time
    this._matchItemObject = {}
    this._itemsLength
    this.playing = false
    this.theme = theme
  }

  get matchItemObject() {
    return this._matchItemObject
  }

  set matchItemObject({ index, item }) {
    this._matchItemObject[index] = item
  }

  get itemsLength() {
    return this._itemsLength
  }

  set itemsLength(length) {
    this._itemsLength = length
  }

  // Initiate array with numbers from user input
  initArr(numberOfUniqueItems) {
    const itemArr = []
    let i = 1

    while (i < numberOfUniqueItems) {
      itemArr.push(i)

      i += 1
    }

    return itemArr
  }

  // Shuffle numbers functionality
  shuffleItems(array) {
    let currentIndex = array.length
    let randomIndex

    while (currentIndex != 0) {

      randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex--

      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]]
    }

    return array
  }

  // Render grid by user params
  renderGrid() {
    const gridRoot = document.getElementById('grid-root')
    let numberOfUniqueItems = Math.pow(this.number, 2) / 2

    if (this.number % 2 === 0) {
      numberOfUniqueItems += 1
    }

    const itemsArr = this.shuffleItems(this.initArr(numberOfUniqueItems))
    const matchItemsArr = this.shuffleItems(this.initArr(numberOfUniqueItems))

    const renderedItems = this.shuffleItems([...itemsArr, ...matchItemsArr])
    
    const { color, font } = this.theme

    const gridStyle = {
      display: 'grid',
      'grid-template-rows': `repeat(${this.number}, ${this.size}px)`,
      'grid-template-columns': `repeat(${this.number}, ${this.size}px)`,
      color: color,
      font: font,
    }

    Object.assign(gridRoot.style, gridStyle)

    renderedItems.forEach((item, index) => {
      this.matchItemObject = { index, item }

      const front = Object.assign(document.createElement('div'), { 
        innerText: item,
      })
      const back = Object.assign(document.createElement('div'), { 
        id: index
      })

      back.setAttribute('data-value', item)
      front.setAttribute('class', 'show-item')
      back.setAttribute('class', 'hide-item')
      back.appendChild(front)

      gridRoot.appendChild(back)
    })
    this.itemsLength = renderedItems.length
  }
}