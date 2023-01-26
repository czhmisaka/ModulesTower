// 一个简单的瀑布流 by guanq

export function waterfall(root, options = {}) {

    var container, images, table, loads;

    // 布局类型（垂直|水平）
    var direction = options.direction || "v"
    // 间距
    var spacing = Number(options.spacing) || 20
    // 基础宽
    var baseWidth = Number(options.baseWidth) || 250
    // 基础高
    var baseHeight = Number(options.height) || 260
    // 精度（在进行图片等比缩放/放大时，计算出的宽/高可能会有极小的误差，导致超过容器宽/高 吧计算的宽/高减去精度值以确保不会超过容器）
    var accuracy = Number(options.accuracy) || 2
    // 图片集合
    var datas = options.datas || null
    // 一行的类名（在direction为vertical生效）
    var rowClass = options.rowClass || ""
    // 单个图片的类名
    var itemClass = options.itemClass || ""

    const throttle = (fn, delay) => {
        let timer = null
        return () => {
            clearTimeout(timer)
            timer = setTimeout(() => fn.bind(this)(arguments), delay)
        }
    }

    const weight = function (weight, times, rwc) {
        let arrs = Array.from(arguments).splice(2, arguments.length)
        let value = weight
        let minValue = weight
        if (times != 1) {
            arrs.forEach(item => {
                let v = Math.abs(item - weight)
                if (v < minValue) {
                    minValue = v
                    value = item
                } else {
                    value = rwc
                }
            })
        } else {
            if (rwc / baseHeight > 2.5) {
                value = rwc
            } else {
                value = -1
            }
        }
        return value
    }

    const toDecimal = number => {
        return Math.floor(number * 100) / 100
    }

    const init = () => {
        if (!root || typeof root != "string") return;

        container = document.querySelector(root)

        console.log(container.scrollHeight, container.scrollTop, 'asd')

        if (datas && datas.length > 0) {
            images = Array.from(buildList())
        } else {
            images = Array.from(container.children)
        }

        if (!images.length) return
        loads = images.length

        let loading = () => {
            loads--
            if (loads <= 0) {
                resizeEvent()
            }
        }

        images.forEach(item => {
            if (itemClass && !item.classList.contains(itemClass)) {
                item.classList.add(itemClass)
            }
            let img = item.querySelector("img")
            if (img.complete) {
                loading()
            } else {
                img.onload = function () {
                    loading()
                }
                img.onerror = function (err) {
                    images.forEach((item, index) => {
                        let img = item.querySelector("img")
                        if (img.src === err.target.src) {
                            images.splice(index, 1)
                        }
                    })
                    loading()
                }
            }
            img.style.display = "block"
        })

        container.style.position = "relative"
        container.style.overflowX = "hidden"

        window.addEventListener("resize", throttle(resizeEvent, 500))
    }

    const buildList = () => {
        let divDOM = document.createElement("div")
        let imageList = ""
        datas.forEach(item => {
            if (typeof item === "string") {
                imageList += `
                    <div class="fall-item">
                        <img alt="${item}" src="${item}"/>
                    </div>
                `
            } else {
                imageList += `
                    <div class="fall-item">
                        <img alt="${item.url}" src="${item.url}"/>
                    </div>
                `
            }
        })
        divDOM.innerHTML = imageList
        return divDOM.children
    }

    const px = (number) => {
        return number + 'px'
    }

    const getMinCol = (g) => {
        var n = 0

        for (let i in g) {
            if (g[i] < g[n]) n = i
        }

        return n
    }

    const getMaxCol = (g) => {
        var n = 0

        for (let i in g) {
            if (g[i] > g[n]) n = i
        }

        return n
    }

    const horizontalRender = () => {
        container.innerHTML = "";
        // 获取一行的宽度
        let rwt = container.clientWidth;
        let rwc = 0;
        let times = 0;
        let row = [], table = [];

        const initRow = () => {
            if (row.length < 1) return

            let w = rwt - (row.length - 1) * spacing;
            let d = 0, l = 0;

            if (row.length == 1) {
                l = baseHeight
            } else {
                //当图片宽度总和不足容器宽度时，通过此方法计算各图片的高度
                row.forEach(item => {
                    let img = item.querySelector("img");
                    d += img.width / img.height;
                });
                l = toDecimal(w / d) - accuracy;
            }

            row.forEach((item, index) => {
                let img = item.querySelector("img");
                let a = img.width / img.height * l;

                img.style.height = l + "px";

                if (index === row.length - 1) {
                    img.style.width = "auto";
                    if (a > w || img.width / img.height > 2.5) {
                        img.style.width = w + "px";
                        img.style.height = img.height / img.width * w + "px";
                    } else {

                    }
                    item.style.marginRight = 0;
                } else {
                    img.style.width = a + "px";
                    item.style.marginRight = spacing + "px";
                }
            });

            table.push(row)
            times = 0
            rwc = 0
            row = []
        }

        images.forEach((item, index) => {
            let image = item.querySelector('img')
            // 先根据基本高度得到一个大概的宽度
            let w = toDecimal((baseHeight / image.naturalHeight)) * image.naturalWidth

            item.dataset.index = index
            // 如果已经超过一行度高度，进行宽度竞争
            if (rwc + w > rwt) {
                let exceed = rwc + w
                let result = weight(rwt, times, rwc, exceed)
                // 如果竞争的结果是保持原图个数，进行换行
                result === rwc && initRow()
            }

            w += spacing

            times++;

            rwc += w
            row.push(item)

            if (index >= images.length - 1) {
                initRow()
            }
        })

        table.forEach((row, index) => {
            let flexRow = document.createElement("div")

            rowClass && flexRow.classList.add(rowClass)
            flexRow.classList.add("fall-row")
            flexRow.style.display = "flex"
            flexRow.style.justifyContent = "space-between";

            if (index < table.length - 1) {
                flexRow.style.marginBottom = spacing + "px"
            }

            flexRow.append(...row)
            container.appendChild(flexRow)
        })
    }

    const verticalRender = () => {
        let rwt = container.clientWidth
        // 获取列数
        let column = Math.floor((rwt + spacing) / (baseWidth + spacing))
        // 如果容器宽度小于了图片最小宽度，默认为1列
        if (column < 1) column = 1
        // 获取每一列的宽度
        let columnW = (rwt + spacing) / column - spacing
        // 如果图片少于列数，平分居中
        if (images.length < column) {
            column = images.length
            columnW = (rwt + spacing) / column - spacing
        }

        table = {}

        for (let i = 0; i < column; i++) { table[i] = 0 }

        images.forEach(item => {
            const image = item.querySelector("img")
            var width = image.naturalWidth
            var height = image.naturalHeight
            var ratio = columnW / width
            var colH = height * ratio

            var minColNum = getMinCol(table)

            var minHeight = table[minColNum] || 0

            image.style.width = "100%"
            image.style.maxWidth = "100%"

            item.style.position = "absolute"
            item.style.top = px(minHeight)
            item.style.left = px((columnW + spacing) * minColNum)
            item.style.width = px(columnW)
            item.style.height = px(colH)

            table[minColNum] = minHeight + colH + spacing

            container.appendChild(item)
        })

        var maxColNum = getMaxCol(table)
        container.style.height = px(table[maxColNum])

    }

    const resizeEvent = () => {
        container.innerHTML = ""
        if (direction === "h") {
            horizontalRender()
        } else {
            verticalRender()
        }
    }

    init()
}