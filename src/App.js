import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sliders:[
        {
          img: require('./assets/images/1.jpg')
        },
        {
          img: require('./assets/images/2.jpg')
        },
        {
          img: require('./assets/images/3.jpg')
        },
        {
          img: require('./assets/images/4.jpg')
        },
        {
          img: require('./assets/images/5.jpg')
        }
      ],
      currentIndex: 1,
      distance: 600,
      initialInterval: 2
    }
    this.transitionEnd = true
    this.temp = null
    this.speed = 30
  }

  componentDidMount() {
    this.init()
  }
  containerStyle() {
    return {
      transform:`translate3d(${-this.state.distance}px, 0, 0)`
    }
  }
  interval() {
    return this.state.initialInterval * 1000
  }

  init() {
    this.play()
    window.onblur = function() { this.stop() }.bind(this)
    window.onfocus = function() { this.play() }.bind(this)
  }

  move = (offset, direction, speed) => {
    if (!this.transitionEnd) return
    this.transitionEnd = false
    if (direction === 1) {
      this.setState({
        currentIndex: this.state.currentIndex + offset/600
      })
    } else {
      this.setState({
        currentIndex: this.state.currentIndex - offset/600
      })
    }

    if (this.state.currentIndex > 5) {
      this.setState({
        currentIndex: 1
      })
    }
    if (this.state.currentIndex < 1) {
      this.setState({
        currentIndex: 5
      })
    }
    const destination = this.state.distance + offset * direction
    this.animateTo(destination, direction, speed)
  }
  animateTo = (des, direc, speed) => {
    if (this.temp) { 
      window.clearInterval(this.temp)
      this.temp = null 
    }
    this.temp = window.setInterval(() => {
      if ((direc === 1 && this.state.distance < des) || (direc === -1) && this.state.distance > des) {
        this.setState({
          distance: this.state.distance + this.speed * direc
        }, () => {
          // console.log(this.state.distance)
        })
      } else {
        this.transitionEnd = true
        window.clearInterval(this.temp)
        this.setState({
          distance: des
        })
        if (des > 3000) {
          this.setState({
            distance: 600
          })
        }
        if (des < 600) {
          this.setState({
            distance: 3000
          })
        }
      }
    }, 20)
  }
  jump = (index) => {
    const direction = index - this.state.currentIndex >= 0 ? 1 : -1
    const offset = Math.abs(index - this.state.currentIndex) * 600
    const jumpSpeed = Math.abs(index - this.state.currentIndex) === 0 ? this.speed : Math.abs(index - this.state.currentIndex) * this.speed
    this.move(offset, direction, jumpSpeed)
  }
  play = () => {
    if (this.timer) {
      window.clearInterval(this.timer)
      this.timer = null
    }
    this.timer = window.setInterval(() => {
      this.move(600, 1, this.speed)
    }, this.interval())
  }
  stop = () => {
    window.clearInterval(this.timer)
    this.timer = null
  }

  render() {
    let { containerStyle, sliders } = this.state

    return (
      <div className="slider">
        <div className="window">
          <ul className="container" style={ this.containerStyle() }>
            <li key={0}>
              <img key={0} src={sliders[sliders.length - 1].img}/>
            </li>
            {
              sliders && sliders.map((slider, index) => {
                return (
                  <li key={index + 1}>
                    <img src={sliders[index].img}/>
                  </li>
                )
              })
            }
            <li>
              <img key={sliders[sliders.length - 1]} src={sliders[0].img}/>
            </li>
          </ul>
          <ul className='dots'>
            {
              sliders && sliders.map((slider, index) => {
                if (index === this.state.currentIndex - 1) {
                 return <li onClick={this.jump.bind(this, index+1)} key={index} className='dotted'></li>
                } else {
                  return <li onClick={this.jump.bind(this, index+1)} key={index}></li>
                }
              })
            }
          </ul>
        </div>
      </div>
    );
  }
}

export default App;
