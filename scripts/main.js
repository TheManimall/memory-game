import MatchGrid from './MatchGrid.js'

function main() {
  let values = {}
  let timeInterval
  let timeOut
  let prevTime
  let prevClicked = {}
  let newGrid
  let itemLength
  let playing = false;
  const formValuesNode = document.getElementById('options-form')
  const optionsContainer = document.getElementById('options-container')
  const lastScreen = document.getElementById('end-root')
  const timer = document.getElementById('timer')
  const gridRoot = document.getElementById('grid-root')

  // Handle timer with setInterval
  const handleTimer = time => {
    let timerTime = time

    timer.innerHTML = timerTime--
    timeInterval = setInterval(() => {
      prevTime = timerTime
      timer.innerHTML = timerTime--
    }, 1000)
  }

  // Handle start timer when user comeback to the game
  const handleMouseMove = () => {
    handleTimer(prevTime)
    timeOut = setTimeout(handleTimeOver, (prevTime * 1000))

    gridRoot.removeEventListener('mousemove', handleMouseMove)
    gridRoot.addEventListener('mouseleave', handleMouseLeave)
  }

  // Handle stop timer when user leave game
  const handleMouseLeave = () => {
    clearInterval(timeInterval)
    clearTimeout(timeOut)

    gridRoot.removeEventListener('mouseleave', handleMouseLeave)
    gridRoot.addEventListener('mousemove', handleMouseMove)
  }

  // Handle submit options for game && initiate MatchGrid class && render Game Grid
  const handleSumbit = (e) => {
    e.preventDefault()

    for(let i = 0; i < (e.target.length - 1); i += 1) {
      values[e.target[i].name] = e.target[i].value
    }

    const { size, number, time } = values

    const themeParams = {
      color: '#fff',
      'font-size': '55px'
    }

    newGrid = new MatchGrid(size, number, time, themeParams)
    newGrid.renderGrid()
    itemLength = newGrid.itemsLength

    optionsContainer.style.display = 'none'
    handleTimer(time)
    prevTime = time

    window.addEventListener('click', handleClick)
    gridRoot.addEventListener('mouseleave', handleMouseLeave)
    timeOut = setTimeout(handleTimeOver, (time * 1000))   
  }
  
  // Handle flip animation for item
  const handleAnimation = item => {
    if (playing) return
  
    playing = true

    anime({
      targets: item,
      scale: [{value: 1}, {value: 1.1}, {value: 1, delay: 100}],
      rotateY: {value: '+=180', delay: 160},
      easing: 'easeInOutSine',
      duration: 120,
      complete: function(){
        playing = false;
        item.firstChild.style.display = 'flex'
      }
    });
  }

  // Handle click by item && compare values and prevValues
  const handleClick = e => {
    const { target: { dataset: { value }, id, nodeName }} = e

    if (nodeName !== 'DIV') return

    const clickedItem = document.getElementById(id)

    handleAnimation(clickedItem)

    if (Object.keys(prevClicked).length) {
      if (prevClicked.value === value && prevClicked.id !== id) {
        prevClicked.element.setAttribute('class', 'disabled')
        clickedItem.setAttribute('class', 'disabled')
        console.log('ELEMENT', { clickedItem, prevClicked });
        clickedItem.firstChild.style.display = 'none'
        
        itemLength -= 2

        if (itemLength <= 0) {
          handleTimeOver(true)
          clearTimeout(timeOut)
        }

        return
      }
      prevClicked.element.firstChild.style.display = 'none'
    }

    prevClicked = { id, value, element: clickedItem }
  }

  // Handle restart Game
  const handleRestartBtn = () => {
    lastScreen.style.display = 'none'
    newGrid.renderGrid()
    itemLength = newGrid.itemsLength

    optionsContainer.style.display = 'none'
    window.addEventListener('click', handleClick)
    timeOut = setTimeout(handleTimeOver, (Number(values.time) * 1000))
    gridRoot.addEventListener('mouseleave', handleMouseLeave)
    handleTimer(Number(values.time))
    prevTime = Number(values.time)   
  }

  // Handle timeout functionality
  const handleTimeOver = (isWin = false) => {
    const restartBtn = document.getElementById('restart-btn')

    window.removeEventListener('click', handleClick)
    lastScreen.style.display = 'flex'
    if (isWin) {
      lastScreen.setAttribute('class', 'win')
    }
    gridRoot.innerHTML = ''
    prevClicked = {}
    restartBtn.addEventListener('click', handleRestartBtn)
    gridRoot.removeEventListener('mousemove', handleMouseMove)
    gridRoot.removeEventListener('mouseleave', handleMouseLeave)
    clearInterval(timeInterval)
  }

  formValuesNode.addEventListener('submit', handleSumbit)
}

main()