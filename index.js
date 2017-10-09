
class Moon {
    constructor(ctx, width, height) {
        this.ctx = ctx
        this.width = width
        this.height = height
    }
    draw() {
        let ctx = this.ctx      
        let gradient = ctx.createRadialGradient(200, 200, 80, 200, 200, 800)
        //径向渐变 : (x0, y0, r0, x1, y1, r1)
        gradient.addColorStop(0, 'rgb(255,255,255)')
        gradient.addColorStop(0.01, 'rgb(70,70,80)')
        gradient.addColorStop(0.2, 'rgb(40,40,50)')
        gradient.addColorStop(0.4, 'rgb(20,20,30)')
        gradient.addColorStop(1, 'rgb(0,0,10)')
        //save：用来保存Canvas的状态。save之后，可以调用Canvas的平移、放缩、旋转、错切、裁剪等操作。
        ctx.save()
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, this.width, this.height)
        // restore：用来恢复Canvas之前保存的状态。防止save后对Canvas执行的操作对后续的绘制有影响// 
        ctx.restore()
    }
}


class Stars {
    constructor(ctx, width, height, amount) {
        this.ctx = ctx
        this.width = width
        this.height = height
        this.stars = this.getStars(amount)
    }

    getStars(amount) {
        let stars = []
        while (amount--) {
            stars.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                r: Math.random() + 0.2
            })
        }
        return stars
    }

    draw() {
        let ctx = this.ctx
        ctx.save()
        ctx.fillStyle = 'white'
        this.stars.forEach(star=> {
            ctx.beginPath()
            ctx.arc(star.x, star.y, star.r, 0, 2 * Math.PI)
            ctx.fill()
        })
        ctx.restore()
    }

    //闪烁，星星半径每隔10帧随机变大或变小
    blink() {
        this.stars = this.stars.map(star=> {
            let sign = Math.random() > 0.5 ? 1 : -1
            star.r += sign * 0.2
            if (star.r < 0) {
                star.r = -star.r
            } else if (star.r > 1) {
                star.r -= 0.2
            }
            return star
        })

    }
}

class Meteor {
    constructor(ctx, x, h) {
        this.ctx = ctx
        this.x = x
        this.y = 0
        this.h = h
        this.vx = -(4 + Math.random() * 4)
        this.vy = -this.vx
        this.len = Math.random() * 300 + 500
    }

    flow() {
        //判定流星出界
        if (this.x < -this.len || this.y > this.h + this.len) {
            return false
        }
        this.x += this.vx
        this.y += this.vy
        return true
    }

    draw() {
        let ctx = this.ctx,
            //径向渐变，从流星头尾圆心，半径越大，透明度越高
            gra = ctx.createRadialGradient(
                this.x, this.y, 0, this.x, this.y, this.len)

        const PI = Math.PI
        gra.addColorStop(0, 'rgba(255,255,255,1)')
        gra.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.save()
        ctx.fillStyle = gra
        ctx.beginPath()
        //流星头，二分之一圆
        ctx.arc(this.x, this.y, 1, PI / 4, 5 * PI / 4)
        //绘制流星尾，三角形
        ctx.lineTo(this.x + this.len, this.y - this.len)
        ctx.closePath()
        ctx.fill()
        ctx.restore()
    }
}


let canvas = document.getElementById('canvas'),
ctx = canvas.getContext('2d'),
width = window.innerWidth,
height = window.innerHeight,
//实例化月亮和星星。流星是随机时间生成，所以只初始化数组
moon = new Moon(ctx, width, height),
stars = new Stars(ctx, width, height, 200),
meteors = [],
count = 0

canvas.width = width
canvas.height = height

//流星生成函数
const meteorGenerator = ()=> {
    //x位置偏移，以免经过月亮
    let x = Math.random() * width + 800
    meteors.push(new Meteor(ctx, x, height))

    //每隔随机时间，生成新流星
    setTimeout(()=> {
        meteorGenerator()
    }, Math.random() * 2000)
}

//每一帧动画生成函数
const frame = ()=> {
    //每隔10帧星星闪烁一次，节省计算资源
    count++
    count % 10 == 0 && stars.blink()

    moon.draw()
    stars.draw()

    meteors.forEach((meteor, index, arr)=> {
        //如果流星离开视野之内，销毁流星实例，回收内存
        if (meteor.flow()) {
            meteor.draw()
        } else {
            arr.splice(index, 1)
        }
    })
    requestAnimationFrame(frame)
}

meteorGenerator()
frame()