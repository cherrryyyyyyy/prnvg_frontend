<template>
    <div>
        <div style="margin-bottom: 20px;">
            魔方密度:
            <select v-model="density" @change="onChangeDensity">
                <option v-for="item in densityList" :value='item'>{{item + ' x ' + item}}</option>
            </select>
        </div>
 
        <div class="decorate-cube">
            <ul class="cube-col" v-for="n in densityNum">
                <li :class="['cube-item', {'item-selecting': isSelecting(n,i), 'item-selected':isSelected(n,i)}]"
                    v-for="i in densityNum" :style="{'width':cubeCellWidth+'px','height':cubeCellHeight+'px'}"
                    :data-x="n" :data-y="i" @click="onClickCubeItem($event)" @mouseenter="onEnterCubeItem($event)">
                    <!-- <van-icon name="plus" color="#bbbbb" :style="{'line-height':cubeCellHeight+'px'}" /> -->
                </li>
            </ul>
 
            <div class="cube-selected" v-for="(item, index) in selectedList"
                :style="{'width':getSelectedWidth(item)+'px','height':getSelectedHeight(item)+'px','top':getSelectedTop(item)+'px','left':getSelectedLeft(item)+'px'}"
                @mouseenter="onEnterSelected(index)">
                <div class="cube-selected-text">
                    {{ Math.round(750/density*((parseInt(item.end.y) - parseInt(item.start.y) + 1))) }}
                    x
                    {{ Math.round(750/density*((parseInt(item.end.x) - parseInt(item.start.x) + 1))) }}
                    像素
                </div>
            </div>
        </div>
    </div>
</template>
 
<script>
    export default {
        data() {
            return {
                'densityList': ['5', '6', '7', '8'],
                'density': '5', //密度。
                'cubeWidth': 320, //魔方宽度。
                'cubeHeight': 320, //魔方高度。
                'selectingItem': {
                    'tempStart': null,
                    'tempEnd': null,
                    'start': null,
                    'end': null
                },
                'selectedList': [] //已经生成的单元。
            }
        },
        computed: {
            //密度值。
            densityNum: function () {
                return parseInt(this.density);
            },
            //单元魔方高度。
            cubeCellHeight: function () {
                return this.cubeHeight / this.density;
            },
            //单元魔方宽度。
            cubeCellWidth: function () {
                return this.cubeWidth / this.density;
            }
        },
        watch: {
        },
        mounted() {
        },
        methods: {
            updateSelecting() {
                //获取开始和结束之间的所有魔方单元。
                var tempStart = this.selectingItem.tempStart;
                var tempEnd = this.selectingItem.tempEnd;
 
                this.selectingItem.start = {
                    x: Math.min(tempStart.x, tempEnd.x)
                    , y: Math.min(tempStart.y, tempEnd.y)
                };
                this.selectingItem.end = {
                    x: Math.max(tempStart.x, tempEnd.x)
                    , y: Math.max(tempStart.y, tempEnd.y)
                };
            },
            //清除正在选择的。
            clearSelecting() {
                this.selectingItem.tempStart = null;
                this.selectingItem.tempEnd = null;
                this.selectingItem.start = null;
                this.selectingItem.end = null;
            },
            coordFromCubeEvent(event) {
                var el = event.currentTarget;
                var x = el.getAttribute('data-x');
                var y = el.getAttribute('data-y');
                console.log('track_x_y_[' + x + ', ' + y + ']');
                return { x: x, y: y };
            },
            isContain(x, y, item) {
                return (item.start.x <= x
                    && x <= item.end.x
                    && item.start.y <= y
                    && y <= item.end.y);
            },
            //魔方点击事件。
            onClickCubeItem: function (event) {
                var domclass = event.currentTarget.getAttribute('class');
                if (-1 !== domclass.indexOf('item-selected')) {
                    console.log("已经被占用");
                    return;
                }
 
                var coord = this.coordFromCubeEvent(event);
 
                if (null == this.selectingItem.tempStart) {
                    this.selectingItem.tempStart = coord;
                    this.selectingItem.tempEnd = coord;
                    this.selectingItem.start = coord;
                    this.selectingItem.end = coord;
                    return;
                }
 
                this.selectingItem.tempEnd = coord;
                this.updateSelecting();
 
                //加入选中的。
                var selectedItem = {
                    'start': this.selectingItem.start,
                    'end': this.selectingItem.end
                }
                this.selectedList.push(selectedItem);
 
                this.clearSelecting();
            },
            onEnterCubeItem: function (event) {
                console.log("track_onEnterCube");
                if (this.selectingItem.tempStart) {
                    var coord = this.coordFromCubeEvent(event);
                    this.selectingItem.tempEnd = coord;
                    this.updateSelecting();
                }
            },
            onEnterSelected: function (index) {
                if (this.selectingItem.tempStart != null) {
                    this.clearSelecting();
                    // splice() 会先从原数组中添加/删除项目 然后返回被删除的项目。
                    this.selectedList.splice(index, 1);
                }
            },
            onChangeDensity: function () {
                this.clearSelecting();
                this.selectedList = [];
            },
            //判断是否正在选择
            isSelecting: function (x, y) {
                var item = this.selectingItem;
                if (item.tempStart) {
                    return this.isContain(x, y, item);
                }
                return false;
            },
            //判断是否已经选择。
            isSelected: function (x, y) {
                var list = this.selectedList;
                for (var i = 0; i < list.length; i++) {
                    if (this.isContain(x, y, list[i])) {
                        return true;
                    }
                }
                return false;
            },
            //计算选中层的宽度。
            getSelectedWidth: function (item) {
                return (parseInt(item.end.x) - parseInt(item.start.x) + 1) * this.cubeCellWidth;
            },
            //计算选中层的高度。
            getSelectedHeight: function (item) {
                return (parseInt(item.end.y) - parseInt(item.start.y) + 1) * this.cubeCellHeight;
            },
            //计算选中层的右边距离。
            getSelectedTop: function (item) {
                return (item.start.y - 1) * this.cubeCellHeight;
            },
            //计算选中层的左边距离。
            getSelectedLeft: function (item) {
                return (item.start.x - 1) * this.cubeCellWidth;
            }
        }
    }
</script>
<style>
    .decorate-cube {
        width: 320px;
        height: 320px;
        position: relative;
    }
 
    .decorate-cube .cube-item {
        border-right: 1px solid #e5e5e5;
    }
 
    .decorate-cube .cube-selected {
        position: absolute;
        background-color: #fff;
        border: 1px solid #ebedf0;
        text-align: center;
        color: #7d7e80;
        cursor: pointer;
        box-sizing: border-box;
    }
 
    .decorate-cube .cube-selected.cube-selected-click {
        background: #e0edff;
        border: 1px solid #155bd4;
        color: #155bd4;
        z-index: 2;
        cursor: auto;
    }
 
    .decorate-cube .cube-selected-text {
        font-size: 12px;
        width: 100%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
    }
 
    .decorate-cube .cube-col {
        float: left;
        list-style: none;
        padding: 0;
        margin: 0;
    }
 
    .decorate-cube .cube-item:first-child {
        border-top: 1px solid #e5e5e5;
    }
 
    .decorate-cube .cube-item {
        background: #f8f8f8;
        border-left: 1px solid #e5e5e5;
        border-bottom: 1px solid #e5e5e5;
        cursor: pointer;
        text-align: center;
        box-sizing: border-box;
    }
 
    .decorate-cube .cube-item.item-selecting {
        background: #e0edff;
    }
 
    .decorate-cube .cube-item.item-selected {
        background: #e0edff;
        visibility: hidden;
    }
</style>