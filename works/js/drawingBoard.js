/**
 * Created by mengfanxu on 17/3/22.
 * # 为工具性方法
 */
$(function () {
    /**
     *  工具 currentToolNum
     *      1：普通笔
     *      2：毛笔
     *      3：圆形
     *      4：方形
     *      5: 文字
     *      6：橡皮擦
     *  线条宽度 lineWidth
     *  笔触颜色 pageLineColor
     *  填充颜色 pageFillColor
     *  透明度 currentAlpha
     */

    var xu = new Vue({
        el: '#drawing-board-page',
        data: {
            trBk: false,
            popupColorShow: false,
            popupColorType: '1', //1 为线条颜色  2 为填充色
            popupColorPosition: {
                x: '100',
                y: '100'
            },
            currentTool: 'iconfont icon-shouhui',
            currentToolNum: '1',
            tools: [
                {dataTool: '1', toolClass: 'iconfont icon-shouhui'},
                {dataTool: '2', toolClass: 'iconfont icon-maobi'},
                {dataTool: '3', toolClass: 'iconfont icon-yuanxing'},
                {dataTool: '4', toolClass: 'iconfont icon-fangkuai'},
                {dataTool: '5', toolClass: 'iconfont icon-t'},
                {dataTool: '6', toolClass: 'iconfont icon-xiangpicas'}
            ],
            selectedToolIndex: '0',
            lineWidth: '1',
            colors: ['#FFDAB9', '#E6E6FA', '#8470FF', '#00CED1', '#7FFFD4', '#00FF7F', '#FFD700', '#CD5C5C', '#BBFFFF',
                '#FFA500', '#FF0000', '#8A2BE2', '#EED5B7', '#F0FFDF', '#0000FF', '#00BFFF', '#AB82FF', '#E066FF',
                '#8B1C62', '#FF82AB', '#EE1289', '#EE0000', '#FF6347', '#FF7F00', '#00FF00', '#00FF7F', '#00FFFF'],
            pageColor: '000000',
            pageLineColor: '000000',
            pageFillColor: 'ffffff',
            newColor: '000000',
            RColor: '00',
            GColor: '00',
            BColor: '00',
            hexColorArr: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'],
            hexColorStr: '0123456789ABCDEF',
            selectAlphaSliderShow: false,
            currentAlpha: 100,
            sliderAlpha: 94,   //透明度选择器的小三角范围为 -6~94  对应的0~100透明度
            inputTextShow: false, //文字输入时临时框
            inputTextPosition: {
                x: '200',
                y: '200'
            },
            inputTextValue: '',
            rectTempPositionShow: false,
            rectTempAttr: {
                width: '0',
                height: '0',
                left: '0',
                top: '0',
                borderWidth: '1',
                borderStyle: 'solid',
                borderColor: '000000',
                backgroundColor: 'ffffff'
            },
            roundTempPositionShow: false,
            roundTempAttr: {
                r: '0',
                left: '0',
                top: '0',
                borderWidth: '1',
                borderStyle: 'solid',
                borderColor: '000000',
                backgroundColor: 'ffffff'
            }
        },
        methods: {
            // 工具 ~选择
            selectTool: function (tool, index) {
                this.currentToolNum = tool.dataTool;
                this.currentTool = tool.toolClass;
                tool.selected = true;
                this.selectedToolIndex = index;
            },
            // 颜色选择器 ~出现
            clickPopupColorShow: function (e) {
                var currentBkColor = $(e.target).data('type') == '1' ? this.pageLineColor : this.pageFillColor;
                this.popupColorType = $(e.target).data('type');
                this.trBk = true;
                this.popupColorShow = true;
                this.pageColor = currentBkColor;
                this.RColor = this.getRGBColor(currentBkColor)[0];
                this.GColor = this.getRGBColor(currentBkColor)[1];
                this.BColor = this.getRGBColor(currentBkColor)[2];
            },
            // 颜色选择器 ~拖拽
            dragPopupColor: function (e) {
                var _this = this,
                    _self = $(e.target),
                    mouseX = _self.offset().left,
                    mouseY = _self.offset().top,
                    offsetX = mouseX - e.pageX,
                    offsetY = mouseY - e.pageY,
                    moving = true;
                document.onmousemove = function (e) {
                    if (!moving) return false;
                    mouseX = e.pageX + offsetX;
                    mouseY = e.pageY + offsetY;
                    _this.popupColorPosition.x = mouseX;
                    _this.popupColorPosition.y = mouseY;
                };
                document.onmouseup = function () {
                    moving = false;
                };
            },
            // 颜色选择器 ~确定
            colorConfirm: function () {
                this.trBk = false;
                this.popupColorShow = false;
                this.popupColorType == '1' ? this.pageLineColor = this.newColor
                    : this.pageFillColor = this.newColor;
            },
            // 颜色选择器 ~取消
            colorCancel: function () {
                this.trBk = false;
                this.popupColorShow = false;
            },
            // 颜色选择器 ~选择
            selectColor: function (e) {
                var selectedColor = this.getAttrValue($(e.target), 'backgroundColor');
                this.newColor = this.getHexColorFromRgb(selectedColor);
                this.RColor = this.getRGBColor(this.getHexColorFromRgb(selectedColor))[0];
                this.GColor = this.getRGBColor(this.getHexColorFromRgb(selectedColor))[1];
                this.BColor = this.getRGBColor(this.getHexColorFromRgb(selectedColor))[2];
            },
            // 颜色选择器 ~绑定
            bindHex: function (e) {
                this.newColor = $(e.target).val();
                this.RColor = this.getRGBColor($(e.target).val())[0];
                this.GColor = this.getRGBColor($(e.target).val())[1];
                this.BColor = this.getRGBColor($(e.target).val())[2];
            },
            bindRColor: function (e) {
                this.RColor = $(e.target).val();
                this.newColor = '' + this.getHexColorFromRgb([this.RColor, this.GColor, this.BColor]);
            },
            bindGColor: function (e) {
                this.GColor = $(e.target).val();
                this.newColor = '' + this.getHexColorFromRgb([this.RColor, this.GColor, this.BColor]);
            },
            bindBColor: function (e) {
                this.BColor = $(e.target).val();
                this.newColor = '' + this.getHexColorFromRgb([this.RColor, this.GColor, this.BColor]);
            },
            bindLineWidth: function (e) {
                this.lineWidth = $(e.target).val();
            },
            bindInputText: function (e) {
                this.inputTextValue = $(e.target).val();
            },
            // 透明度选择器 ~出现
            clickSelectAlphaSliderShow: function () {
                this.selectAlphaSliderShow = !this.selectAlphaSliderShow;
            },
            // 透明选择器 ~滑动
            sliderMove: function (e) {
                var _this = this,
                    _self = $(e.target),
                    mouseX = _self.position().left,
                    mouseY = _self.position().top,
                    offsetX = mouseX - e.pageX,
                    offsetY = mouseY - e.pageY,
                    moving = true;
                document.onmousemove = function (e) {
                    if (!moving) return false;
                    mouseX = e.pageX + offsetX;
                    mouseY = e.pageY + offsetY;
                    _this.sliderAlpha = mouseX <= -6 ? -6 : mouseX >= 94 ? 94 : mouseX;
                    _this.currentAlpha = _this.sliderAlpha + 6;
                };
                document.onmouseup = function () {
                    moving = false;
                };
            },
            // 透明选择器 ~输入
            bindAlpha: function (e) {
                var _selfVal = $(e.target).val();
                this.currentAlpha = _selfVal <= 0 ? 0 : _selfVal >= 100 ? 100 : _selfVal;
                this.sliderAlpha = this.currentAlpha - 4;
            },
            //画板 ~绘制
            painting: function (e) {
                var _self = this,
                    canvas = $(e.target),
                    ctx = canvas[0].getContext('2d'),
                    canvasAttribute = {
                        width: parseInt(this.getAttrValue(canvas, 'width', 'px')),
                        height: parseInt(this.getAttrValue(canvas, 'height', 'px')),
                        left: parseInt(canvas.position().left),
                        top: parseInt(canvas.position().top)
                    },
                    xTemp, yTemp, wTemp = 0, hTemp = 0, rTemp = 0,//用于临时矩形和圆形
                    fontSize, //用于输入文字
                    lineWidth,//用于橡皮擦
                    mouseStyle = $('<div></div>'), //用于临时橡皮擦
                    moving = false;
                $(document).on('mousedown touchstart', 'canvas', function (e) {
                    e.stopImmediatePropagation();
                    switch (_self.currentToolNum) {
                        case '1':
                            moving = true;

                            ctx.beginPath();
                            ctx.lineCap = "butt";
                            ctx.strokeStyle = '#' + _self.pageLineColor;
                            ctx.lineWidth = _self.lineWidth;
                            ctx.moveTo(e.pageX - canvas.offset().left, e.pageY - canvas.offset().top);
                            break;
                        case '2':
                            moving = true;

                            ctx.beginPath();
                            ctx.lineCap = "round";
                            ctx.strokeStyle = '#' + _self.pageLineColor;
                            ctx.lineWidth = _self.lineWidth < 5 ? 5 : _self.lineWidth; //设置毛笔最小线粗
                            ctx.moveTo(e.pageX - canvas.offset().left, e.pageY - canvas.offset().top);
                            break;
                        case '3':
                            moving = true;

                            ctx.beginPath();
                            ctx.lineWidth = _self.lineWidth;
                            ctx.strokeStyle = '#' + _self.pageLineColor;
                            ctx.fillStyle = '#' + _self.pageFillColor;
                            _self.roundTempAttr.r = '0';
                            _self.roundTempAttr.left = e.pageX;
                            _self.roundTempAttr.top = e.pageY;
                            _self.roundTempAttr.borderWidth = _self.lineWidth;
                            _self.roundTempAttr.borderColor = _self.pageLineColor;
                            _self.roundTempAttr.backgroundColor = _self.pageFillColor;
                            _self.roundTempPositionShow = true;

                            xTemp = e.pageX - canvas.offset().left;
                            yTemp = e.pageY - canvas.offset().top;

                            break;
                        case '4':
                            moving = true;

                            ctx.lineWidth = _self.lineWidth;
                            ctx.strokeStyle = '#' + _self.pageLineColor;
                            ctx.fillStyle = '#' + _self.pageFillColor;
                            _self.rectTempAttr.left = e.pageX;
                            _self.rectTempAttr.top = e.pageY;
                            _self.rectTempAttr.width = '0';
                            _self.rectTempAttr.height = '0';
                            _self.rectTempAttr.borderWidth = _self.lineWidth;
                            _self.rectTempAttr.borderColor = _self.pageLineColor;
                            _self.rectTempAttr.backgroundColor = _self.pageFillColor;
                            _self.rectTempPositionShow = true;

                            xTemp = e.pageX - canvas.offset().left;
                            yTemp = e.pageY - canvas.offset().top;
                            break;
                        case '5':
                            moving = true;

                            fontSize = _self.lineWidth < 12 ? 12 : _self.lineWidth;
                            if (!_self.inputTextShow) {
                                _self.inputTextShow = true;
                                _self.inputTextPosition.x = e.pageX;
                                _self.inputTextPosition.y = e.pageY;
                            } else {
                                // 如果点击的是input
                                // !canvas.is(e.target) 点击的元素不是他自己
                                // canvas.has(e.target).length === 0 他自己没有他自己
                                if (!(!canvas.is(e.target) && canvas.has(e.target).length === 0)) {
                                    _self.inputTextShow = false;
                                    if (_self.inputTextValue != '' && _self.inputTextValue != undefined
                                        && _self.inputTextValue != null) {
                                        ctx.font = fontSize + "px Microsoft Yahei";
                                        ctx.fillStyle = '#' + _self.pageLineColor;
                                        ctx.textBaseline = "top";
                                        ctx.fillText(_self.inputTextValue,
                                            _self.inputTextPosition.x - canvasAttribute.left,
                                            _self.inputTextPosition.y - canvasAttribute.top);
                                        ctx.fillStyle = '#' + _self.pageLineColor;
                                        _self.inputTextValue = "";
                                    }
                                }
                            }
                            break;
                        case '6':
                            moving = true;

                            ctx.beginPath();
                            lineWidth = _self.lineWidth < 10 ? 10 : _self.lineWidth;
                            ctx.lineCap = "round";
                            ctx.strokeStyle = '#ffffff';
                            ctx.lineWidth = lineWidth;
                            ctx.moveTo(e.pageX - canvas.offset().left, e.pageY - canvas.offset().top);
                            mouseStyle.css({
                                position: 'fixed',
                                width: lineWidth + 'px',
                                height: lineWidth + 'px',
                                backgroundColor: '#fff',
                                border: '1px solid #000',
                                borderRadius: '50%'
                            });
                            $('body').append(mouseStyle);
                            break;
                        default:
                            break;
                    }
                });
                $(document).on('mousemove touchmove', 'canvas', function (e) {
                    e.stopImmediatePropagation();
                    switch (_self.currentToolNum) {
                        case '1':
                        case '2':
                            if (!moving) return false;
                            ctx.lineTo(e.pageX - canvas.offset().left, e.pageY - canvas.offset().top);
                            ctx.stroke();
                            break;
                        case '3':
                            if (!moving) return false;
                            //这里暂且用pageX作为半径，以后有需要再改
                            _self.roundTempAttr.r = (e.pageX - _self.roundTempAttr.left) > 200 ? 200
                                : (e.pageX - _self.roundTempAttr.left);
                            rTemp = _self.roundTempAttr.r / 2;
                            break;
                        case '4':
                            if (!moving) return false;

                            _self.rectTempAttr.width = e.pageX - _self.rectTempAttr.left;
                            _self.rectTempAttr.height = e.pageY - _self.rectTempAttr.top;
                            wTemp = e.pageX - _self.rectTempAttr.left;
                            hTemp = e.pageY - _self.rectTempAttr.top;
                            break;
                        case '6':
                            if (!moving) return false;
                            mouseStyle.css({
                                left: e.pageX - lineWidth / 2 + 'px',
                                top: e.pageY - lineWidth / 2 + 'px'
                            });
                            ctx.lineTo(e.pageX - canvas.offset().left, e.pageY - canvas.offset().top);
                            ctx.stroke();
                            break;
                        default:
                            break;
                    }
                });
                $(document).on('mouseup touchend', function (e) {
                    e.stopImmediatePropagation();
                    switch (_self.currentToolNum) {
                        case '1':
                        case '2':
                            moving = false;
                            ctx.closePath();
                            break;
                        case '3':
                            moving = false;

                            ctx.beginPath();
                            ctx.strokeStyle = '#' + _self.pageLineColor;
                            ctx.fillStyle = '#' + _self.pageFillColor;
                            ctx.arc(xTemp + rTemp, yTemp + rTemp, rTemp, 0, 2 * Math.PI);
                            ctx.stroke();
                            ctx.fill();
                            ctx.closePath();
                            _self.roundTempPositionShow = false;
                            xTemp = yTemp = rTemp = 0;
                            break;
                        case '4':
                            moving = false;

                            ctx.beginPath();
                            ctx.strokeStyle = '#' + _self.pageLineColor;
                            ctx.fillStyle = '#' + _self.pageFillColor;
                            ctx.rect(xTemp, yTemp, wTemp, hTemp);
                            ctx.stroke();
                            ctx.fill();
                            ctx.closePath();
                            _self.rectTempPositionShow = false;
                            xTemp = yTemp = wTemp = hTemp = 0;
                            break;
                        case '5':
                            break;
                        case '6':
                            moving = false;
                            mouseStyle.remove();
                            ctx.closePath();
                            break;
                        default:
                            break;
                    }
                });
            },
            //画板 ~下载
            downloadImage: function () {
                var canvas = $(document).find('canvas'),
                    type = 'png',
                    imageData = canvas[0].toDataURL(type).replace(this.fixType(type), 'image/octet-stream'),
                    filename = '' + new Date().getDate() + '.' + type;
                this.saveFile(imageData, filename);
            },
            fixType: function (type) {
                type = type.toLocaleLowerCase().replace(/jpg/i, 'jpeg');
                var r = type.match(/png|jpeg|bmp|gif/)[0];
                return 'image/' + r;
            },
            saveFile: function (data, filename) {
                var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
                save_link.href = data;
                save_link.download = filename;
                var event = document.createEvent('MouseEvents');
                event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                save_link.dispatchEvent(event);
            },
            // 画板 ~清屏
            clearScreen: function () {
                var canvas = $(document).find('canvas'),
                    ctx = canvas[0].getContext('2d');
                ctx.clearRect(0, 0, canvas.width(), canvas.height());
            },
            //=========== 方法区 ===========
            // 获取属性的具体数值 #
            getAttrValue: function (target, attr, unit) {
                unit = unit || "";
                return '' + target.css(attr).replace(unit, '');
            },
            // 获取颜色值得具体数值 #
            getColorValue: function (str) {
                return str.replace('#', '');
            },
            //判断16进制数的合法性 #
            hexColorValueValid: function (hexColorValue) {
                if (hexColorValue.length > 6) return false;
                for (var i = 0, len = hexColorValue.length; i < len; i++) {
                    if (this.hexColorStr.indexOf(hexColorValue.toUpperCase().charAt(i)) == -1) return false;
                }
                return true;
            },
            // 获取RGB颜色值 hexColorValue:'000000'
            getRGBColor: function (hexColorValue) {
                //不非法直接返回黑色
                if (!this.hexColorValueValid(hexColorValue)) return ['00', '00', '00'];

                // 获取RGB值
                var tempR, tempG, tempB,
                    hexColorValueTemp = hexColorValue || '000000'; //默认为黑色
                switch (hexColorValueTemp.length) {
                    case 1:
                        tempR = tempG = tempB = this.calRGBValue(hexColorValueTemp.toUpperCase().repeat(2));
                        break;
                    case 2:
                        tempR = tempG = tempB = this.calRGBValue(hexColorValueTemp.toUpperCase());
                        break;
                    case 3:
                        tempR = this.calRGBValue(hexColorValueTemp.substring(0, 1).toUpperCase().repeat(2));
                        tempG = this.calRGBValue(hexColorValueTemp.substring(1, 2).toUpperCase().repeat(2));
                        tempB = this.calRGBValue(hexColorValueTemp.substring(2, 3).toUpperCase().repeat(2));
                        break;
                    case 6:
                        tempR = this.calRGBValue(hexColorValueTemp.substring(0, 2).toUpperCase());
                        tempG = this.calRGBValue(hexColorValueTemp.substring(2, 4).toUpperCase());
                        tempB = this.calRGBValue(hexColorValueTemp.substring(4, 6).toUpperCase());
                        break;
                    default:
                        tempR = tempG = tempB = '00';
                        break;
                }
                return [tempR, tempG, tempB];
            },
            // 获取16进制颜色值
            getHexColorFromRgb: function (RgbColor) {
                var tempR, tempG, tempB;
                if (RgbColor.indexOf('rgb') != -1) {
                    tempR = this.RGBReg(RgbColor)[0];
                    tempG = this.RGBReg(RgbColor)[1];
                    tempB = this.RGBReg(RgbColor)[2];
                } else {
                    tempR = RgbColor[0];
                    tempG = RgbColor[1];
                    tempB = RgbColor[2];
                }
                return '' + this.calHexValue(tempR) + this.calHexValue(tempG) + this.calHexValue(tempB);
            },

            // 计算RGB数值 #
            calRGBValue: function (hexVal) {
                var result = this.getHexIndex(hexVal.charAt(0)) * 16 + this.getHexIndex(hexVal.charAt(1));
                return result >= 10 ? result : '0' + result;
            },
            // 根据位置获得16进制数 #
            getHexValue: function (index) {
                return this.hexColorStr.charAt(index);
            },
            // 把RGB其中一项转化成16进制数 #
            calHexValue: function (val) {
                return this.getHexValue(this.getInt16(val)) + this.getHexValue(this.getRem16(val));
            },
            //获得数字对应的16进制数列表的位置 #
            getHexIndex: function (value) {
                return this.hexColorStr.indexOf(value);
            },
            // 取整 #
            getInt16: function (num) {
                return Math.floor(num / 16);
            },
            // 取余 #
            getRem16: function (num) {
                return num % 16;
            },
            //正则匹配RGB颜色值 #
            /**
             *
             * @param str rgb(n,n,n)
             * @returns {Array} [n,n,n]
             */
            RGBReg: function (str) {
                return str.match(/\d+/g);
            },
            HexReg: function (str) {
                return str.match(/\w+/g);
            },
            //对象转化为数组 #
            ObjToArr: function (obj) {
                var tempArr = [];
                for (var item in obj) {
                    tempArr.push(obj[item]);
                }
                return tempArr;
            },
            //计算绘制圆形时left,top #
            calRoundPosition: function (r) {
                return (2 - Math.sqrt(2)) / 2 * r;
            }
        }
    });

    // 重复字符串 #
    String.prototype.repeat = function (n) {
        var result = '';
        for (var i = 0; i < n; i++) {
            result += this;
        }
        return result;
    };
});