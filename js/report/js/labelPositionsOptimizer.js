function labelPositionOptimizerUsingArea2_2(labelW, labelH, count, x1, y1) {
    getLabelPositions2HelperObj = {};
    var minW = 30;
    var minH = 30;
    var labelR = labelW / labelH;
    var widthGreaterThanHeight = labelW > labelH;
    var labelH3, labelW3, labelH2 = labelH, labelW2 = labelW;
    while (labelW2 > minW && labelH2 > minH) {
        if (widthGreaterThanHeight) {
            labelH3 = labelH2 - 1;
            labelW3 = Math.floor(labelH3 * labelR);
        } else {
            labelW3 = labelW2 - 1;
            labelH3 = Math.floor(labelW3 / labelR);
        }
        labelW2 = labelW3;
        labelH2 = labelH3;
        //call helper function here to see this labelW2 and this labelH2 can fit count number of labels
        if (labelPositionOptimizerUsingAreaHelper_2(labelW2, labelH2, count, x1, y1)) {
            return { width: labelW2, height: labelH2, originalWidth: labelW, originalHeight: labelH };
        } else if (labelPositionOptimizerUsingAreaHelper2_2(labelW2, labelH2, count, x1, y1)) {
            return { width: labelW2, height: labelH2, originalWidth: labelW, originalHeight: labelH };
        }
    }
    return { width: minW, height: minH, originalWidth: labelW, originalHeight: labelH };
}

function labelPositionOptimizerUsingAreaHelper_2(labelW, labelH, count, x1, y1) {
    var pageScreenWidth = document.getElementById('pageScreen').offsetWidth;
    var pageScreenHeight = document.getElementById('pageScreen').offsetHeight;
    /*var containerWidth = document.getElementById('container').offsetWidth;
    var containerHeight = document.getElementById('container').offsetHeight;
    var containerLeft = document.getElementById('container').offsetLeft;*/
    var containerWidth = document.getElementById('canvas').offsetWidth;
    var containerHeight = document.getElementById('canvas').offsetHeight;
    var containerLeft = document.getElementById('canvas').offsetLeft;
    var leftSideWidth = containerLeft - globalObj.spacing.pageSpacingLeftRight;
    var rightSideWidth = pageScreenWidth - containerLeft - containerWidth - globalObj.spacing.pageSpacingLeftRight;
    //var containerTop = document.getElementById('container').offsetTop;
    var containerTop = document.getElementById('canvas').offsetTop;
    var downSideHeight = pageScreenHeight - containerTop - containerHeight - globalObj.spacing.pageSpacingUpDown;
    var upSideHeight = containerTop - globalObj.spacing.pageSpacingUpDown;
    var useTheseSides = {
        up: upSideHeight >= labelH ? true : false,
        left: leftSideWidth >= labelW ? true : false,
        right: rightSideWidth >= labelW ? true : false,
        down: downSideHeight >= labelH ? true : false
    };
    var startPositions = {
        up: {
            startX: useTheseSides.up ? globalObj.spacing.pageSpacingLeftRight : 0,
            startY: useTheseSides.up ? globalObj.spacing.pageSpacingUpDown : 0,
            endX: useTheseSides.up ? pageScreenWidth : 0,
            endY: useTheseSides.up ? containerTop : 0,
            currentX: 0
        },
        left: {
            startX: useTheseSides.left ? globalObj.spacing.pageSpacingLeftRight : 0,
            startY: useTheseSides.left ? (useTheseSides.up ? containerTop : globalObj.spacing.pageSpacingUpDown) : 0,
            endX: useTheseSides.left ? containerLeft : 0,
            endY: useTheseSides.left ? (useTheseSides.down ? pageScreenHeight : containerTop + containerHeight) : 0,
            currentY: 0
        },
        right: {
            startX: useTheseSides.right ? containerLeft + containerWidth : 0,
            startY: useTheseSides.right ? (useTheseSides.up ? containerTop : globalObj.spacing.pageSpacingUpDown) : 0,
            endX: useTheseSides.right ? pageScreenWidth : 0,
            endY: useTheseSides.right ? (useTheseSides.down ? containerTop + containerHeight : pageScreenHeight) : 0,
            currentY: 0
        },
        down: {
            startX: useTheseSides.down ? globalObj.spacing.pageSpacingLeftRight : 0,
            startY: useTheseSides.down ? containerTop + containerHeight : 0,
            endX: useTheseSides.down ? pageScreenWidth : 0,
            endY: useTheseSides.down ? pageScreenHeight - globalObj.spacing.pageSpacingUpDown : 0,
            currentX: 0
        }
    };
    var roundRobinULRD = 1;
    var countHelper = 0;
    startPositions.up.currentX = startPositions.up.startX;
    startPositions.left.currentY = startPositions.left.startY;
    startPositions.right.currentY = startPositions.right.startY;
    startPositions.down.currentX = startPositions.down.startX;
    var x1Up = [];
    var y1Up = [];
    var x1Left = [];
    var y1Left = [];
    var x1Right = [];
    var y1Right = [];
    var x1Down = [];
    var y1Down = [];
    while (countHelper < count - 1) {
        var lastCountHelper = countHelper;
        switch (roundRobinULRD) {
            case 1: //up
                if ((startPositions.up.currentX + ((3 * labelW) + (globalObj.spacing.chartSpacingLeftRight * 4)))
                    <= startPositions.up.endX) {
                    x1Up.push(startPositions.up.currentX);
                    y1Up.push(startPositions.up.startY);
                    startPositions.up.currentX += (3 * labelW) + (globalObj.spacing.chartSpacingLeftRight * 4);
                    countHelper++;
                }
                break;
            case 2: //left
                if ((startPositions.left.currentY + ((3 * labelH) + (globalObj.spacing.chartSpacingUpDown * 4)))
                    <= startPositions.left.endY) {
                    x1Left.push(startPositions.left.startX);
                    y1Left.push(startPositions.left.currentY);
                    startPositions.left.currentY += (3 * labelH) + (globalObj.spacing.chartSpacingUpDown * 4);
                    countHelper++;
                }
                break;
            case 3: //right
                if ((startPositions.right.currentY + ((3 * labelH) + (globalObj.spacing.chartSpacingUpDown * 4)))
                    <= startPositions.right.endY) {
                    x1Right.push(startPositions.right.startX);
                    y1Right.push(startPositions.right.currentY);
                    startPositions.right.currentY += (3 * labelH) + (globalObj.spacing.chartSpacingUpDown * 4);
                    countHelper++;
                }
                break;
            case 4: //down
                if ((startPositions.down.currentX + ((3 * labelW) + (globalObj.spacing.chartSpacingLeftRight * 4)))
                    <= startPositions.down.endX) {
                    x1Down.push(startPositions.down.currentX);
                    y1Down.push(startPositions.down.startY);
                    startPositions.down.currentX += (3 * labelW) + (globalObj.spacing.chartSpacingLeftRight * 4);
                    countHelper++;
                }
                break;
            default:
                break;
        }
        if (lastCountHelper == countHelper)
            return false;
        if (++roundRobinULRD > 4) {
            roundRobinULRD = 1;
        }
    }

    if (x1Up.length > 0) {
        var upUsedWidth = (x1Up[x1Up.length - 1] + (labelW * 3)) - x1Up[0];
        var upMarginX = (pageScreenWidth - upUsedWidth) / 2;
        var upMarginY = (containerTop - labelH) / 2;
        upMarginX = isNaN(upMarginX) ? 0 : upMarginX;
        upMarginY = isNaN(upMarginY) ? 0 : upMarginY;
        for (var i = 0; i < x1Up.length; i++) {
            x1Up[i] = Math.floor(x1Up[i] + upMarginX);
            y1Up[i] = Math.floor(y1Up[i] + upMarginY);
            getLabelPositions2HelperObj[x1Up[i] + ',' + y1Up[i]] = 'up';
        }
    }

    if (x1Left.length > 0) {
        var leftWidth = containerLeft - globalObj.spacing.pageSpacingLeftRight;
        var leftHeight = containerHeight;
        if (!useTheseSides.up) {
            leftHeight += containerTop;
        }
        if (!useTheseSides.down) {
            leftHeight += (pageScreenHeight - containerHeight - containerTop);
        }
        var leftUsedHeight = (y1Left[y1Left.length - 1] + (labelH * 3)) - y1Left[0];
        var leftMarginX = (leftWidth - labelW) / 2;
        var leftMarginY = (leftHeight - leftUsedHeight) / 2;
        leftMarginX = isNaN(leftMarginX) ? 0 : leftMarginX;
        leftMarginY = isNaN(leftMarginY) ? 0 : leftMarginY;
        for (var i = 0; i < x1Left.length; i++) {
            y1Left[i] = Math.floor(y1Left[i] + leftMarginY);
            getLabelPositions2HelperObj[x1Left[i] + ',' + y1Left[i]] = 'left';
        }
    }

    if (x1Right.length > 0) {
        var rightUsedHeight = (y1Right[y1Right.length - 1] + (labelH * 3)) - y1Right[0];
        var rightHeight = containerHeight;
        if (!useTheseSides.up) {
            rightHeight += containerTop;
        }
        if (!useTheseSides.down) {
            rightHeight += (pageScreenHeight - containerHeight - containerTop);
        }
        var rightMarginX = pageScreenWidth - (containerLeft + containerWidth) -
            (labelW + globalObj.spacing.pageSpacingLeftRight);
        var rightMarginY = (rightHeight - rightUsedHeight) / 2;
        rightMarginX = isNaN(rightMarginX) ? 0 : rightMarginX;
        rightMarginY = isNaN(rightMarginY) ? 0 : rightMarginY;
        for (var i = 0; i < x1Right.length; i++) {
            x1Right[i] = Math.floor(x1Right[i] + rightMarginX);
            y1Right[i] = Math.floor(y1Right[i] + rightMarginY);
            getLabelPositions2HelperObj[x1Right[i] + ',' + y1Right[i]] = 'right';
        }
    }

    if (x1Down.length > 0) {
        var bottomWidth = pageScreenWidth;
        var bottomHeight = pageScreenHeight - containerHeight - containerTop;
        var downUsedWidth = (x1Down[x1Down.length - 1] + (labelW * 3)) - x1Down[0];
        var downMarginX = (bottomWidth - downUsedWidth) / 2;
        var downMarginY = (bottomHeight - labelH) / 2;
        downMarginX = isNaN(downMarginX) ? 0 : downMarginX;
        downMarginY = isNaN(downMarginY) ? 0 : downMarginY;
        for (var i = 0; i < x1Down.length; i++) {
            x1Down[i] = Math.floor(x1Down[i] + downMarginX);
            y1Down[i] = Math.floor(y1Down[i] + downMarginY);
            getLabelPositions2HelperObj[x1Down[i] + ',' + y1Down[i]] = 'down';
        }
    }

    rotateHelper = 0;
    while (x1Up.length > 0 || x1Left.length > 0 || x1Right.length > 0 || x1Down.length > 0) {
        switch (rotateHelper++) {
            case 0:
                if (x1Up.length > 0) {
                    x1.push(x1Up.shift());
                    y1.push(y1Up.shift());
                }
                break;
            case 1:
                if (x1Left.length > 0) {
                    x1.push(x1Left.shift());
                    y1.push(y1Left.shift());
                }
                break;
            case 2:
                if (x1Right.length > 0) {
                    x1.push(x1Right.shift());
                    y1.push(y1Right.shift());
                }
                break;
            case 3:
                if (x1Down.length > 0) {
                    x1.push(x1Down.shift());
                    y1.push(y1Down.shift());
                }
                rotateHelper = 0;
                break;
            default:
                break;
        }
    }
    return true;
}

function labelPositionOptimizerUsingAreaHelper2_2(labelW, labelH, count, x1, y1) {
    var pageScreenWidth = document.getElementById('pageScreen').offsetWidth;
    var pageScreenHeight = document.getElementById('pageScreen').offsetHeight;
    var containerWidth = document.getElementById('container').offsetWidth;
    var containerHeight = document.getElementById('container').offsetHeight;
    var containerLeft = document.getElementById('container').offsetLeft;
    var leftSideWidth = containerLeft - globalObj.spacing.pageSpacingLeftRight;
    var rightSideWidth = pageScreenWidth - containerLeft - containerWidth - globalObj.spacing.pageSpacingLeftRight;
    var containerTop = document.getElementById('container').offsetTop;
    var downSideHeight = pageScreenHeight - containerTop - containerHeight - globalObj.spacing.pageSpacingUpDown;
    var upSideHeight = containerTop - globalObj.spacing.pageSpacingUpDown;
    var useTheseSides = {
        up: upSideHeight >= labelH ? true : false,
        left: leftSideWidth >= labelW ? true : false,
        right: rightSideWidth >= labelW ? true : false,
        down: downSideHeight >= labelH ? true : false
    };
    var startPositions = {
        up: {
            startX: useTheseSides.up ? (useTheseSides.left ? containerLeft : globalObj.spacing.pageSpacingLeftRight) : 0,
            startY: useTheseSides.up ? globalObj.spacing.pageSpacingUpDown : 0,
            endX: useTheseSides.up ? (useTheseSides.right ? containerLeft + containerWidth : pageScreenWidth) : 0,
            endY: useTheseSides.up ? containerTop : 0,
            currentX: 0
        },
        left: {
            startX: useTheseSides.left ? globalObj.spacing.pageSpacingLeftRight : 0,
            startY: useTheseSides.left ? globalObj.spacing.pageSpacingUpDown : 0,
            endX: useTheseSides.left ? containerLeft : 0,
            endY: useTheseSides.left ? pageScreenHeight : 0,
            currentY: 0
        },
        right: {
            startX: useTheseSides.right ? containerLeft + containerWidth : 0,
            startY: useTheseSides.right ? globalObj.spacing.pageSpacingUpDown : 0,
            endX: useTheseSides.right ? pageScreenWidth : 0,
            endY: useTheseSides.right ? pageScreenHeight : 0,
            currentY: 0
        },
        down: {
            startX: useTheseSides.down ? (useTheseSides.left ? containerLeft : globalObj.spacing.pageSpacingLeftRight) : 0,
            startY: useTheseSides.down ? containerTop + containerHeight : 0,
            endX: useTheseSides.down ? (useTheseSides.right ? containerLeft + containerWidth : pageScreenWidth) : 0,
            endY: useTheseSides.down ? pageScreenHeight - globalObj.spacing.pageSpacingUpDown : 0,
            currentX: 0
        }
    };
    var roundRobinULRD = 1;
    var countHelper = 0;
    startPositions.up.currentX = startPositions.up.startX;
    startPositions.left.currentY = startPositions.left.startY;
    startPositions.right.currentY = startPositions.right.startY;
    startPositions.down.currentX = startPositions.down.startX;
    var x1Up = [];
    var y1Up = [];
    var x1Left = [];
    var y1Left = [];
    var x1Right = [];
    var y1Right = [];
    var x1Down = [];
    var y1Down = [];
    var overRidden = { up: 0, left: 0, right: 0, down: 0 };
    while (countHelper < count - 1) {
        var lastCountHelper = countHelper;
        var overRideLastCountHelper = false;
        switch (roundRobinULRD) {
            case 1: //up
                if (useTheseSides.up && (startPositions.up.currentX + ((3 * labelW) + (globalObj.spacing.chartSpacingLeftRight * 4)))
                    <= startPositions.up.endX) {
                    x1Up.push(startPositions.up.currentX);
                    y1Up.push(startPositions.up.startY);
                    startPositions.up.currentX += (3 * labelW) + (globalObj.spacing.chartSpacingLeftRight * 4);
                    countHelper++;
                } else {
                    overRidden.up++;
                    overRideLastCountHelper = true;
                }
                break;
            case 2: //left
                if (useTheseSides.left && (startPositions.left.currentY + ((3 * labelH) + (globalObj.spacing.chartSpacingUpDown * 4)))
                    <= startPositions.left.endY) {
                    x1Left.push(startPositions.left.startX);
                    y1Left.push(startPositions.left.currentY);
                    startPositions.left.currentY += (3 * labelH) + (globalObj.spacing.chartSpacingUpDown * 4);
                    countHelper++;
                } else {
                    overRidden.left++;
                    overRideLastCountHelper = true;
                }
                break;
            case 3: //right
                if (useTheseSides.right && (startPositions.right.currentY + ((3 * labelH) + (globalObj.spacing.chartSpacingUpDown * 4)))
                    <= startPositions.right.endY) {
                    x1Right.push(startPositions.right.startX);
                    y1Right.push(startPositions.right.currentY);
                    startPositions.right.currentY += (3 * labelH) + (globalObj.spacing.chartSpacingUpDown * 4);
                    countHelper++;
                } else {
                    overRidden.right++;
                    overRideLastCountHelper = true;
                }
                break;
            case 4: //down
                if (useTheseSides.down && (startPositions.down.currentX + ((3 * labelW) + (globalObj.spacing.chartSpacingLeftRight * 4)))
                    <= startPositions.down.endX) {
                    x1Down.push(startPositions.down.currentX);
                    y1Down.push(startPositions.down.startY);
                    startPositions.down.currentX += (3 * labelW) + (globalObj.spacing.chartSpacingLeftRight * 4);
                    countHelper++;
                } else {
                    overRidden.down++;
                    overRideLastCountHelper = true;
                }
                break;
            default:
                break;
        }
        if (lastCountHelper == countHelper &&
            (overRidden.up > 10 || overRidden.left > 10 ||
                overRidden.right > 10 || overRidden.down > 10)) {
            //looped around too many times
            return false;
        }
        if (++roundRobinULRD > 4) {
            roundRobinULRD = 1;
        }
    }

    if (x1Up.length > 0) {
        var upUsedWidth = (x1Up[x1Up.length - 1] + (labelW * 3)) - x1Up[0];
        var upMarginX = (pageScreenWidth - upUsedWidth) / 2;
        var upMarginY = (containerTop - labelH) / 2;
        upMarginX = isNaN(upMarginX) ? 0 : upMarginX;
        upMarginY = isNaN(upMarginY) ? 0 : upMarginY;
        for (var i = 0; i < x1Up.length; i++) {
            x1Up[i] = Math.floor(x1Up[i] + upMarginX);
            y1Up[i] = Math.floor(y1Up[i] + upMarginY);
            getLabelPositions2HelperObj[x1Up[i] + ',' + y1Up[i]] = 'up';
        }
    }

    if (x1Left.length > 0) {
        var leftWidth = containerLeft - globalObj.spacing.pageSpacingLeftRight;
        var leftHeight = startPositions.left.endY - startPositions.left.startY;
        /*if (!useTheseSides.up) {
            leftHeight += containerTop;
        }
        if (!useTheseSides.down) {
            leftHeight += (pageScreenHeight - containerHeight - containerTop);
        }*/
        var leftUsedHeight = (y1Left[y1Left.length - 1] + (labelH * 3)) - y1Left[0];
        var leftMarginX = (leftWidth - labelW) / 2;
        var leftMarginY = (leftHeight - leftUsedHeight) / 2;
        leftMarginX = isNaN(leftMarginX) ? 0 : leftMarginX;
        leftMarginY = isNaN(leftMarginY) ? 0 : leftMarginY;
        for (var i = 0; i < x1Left.length; i++) {
            y1Left[i] = Math.floor(y1Left[i] + leftMarginY);
            getLabelPositions2HelperObj[x1Left[i] + ',' + y1Left[i]] = 'left';
        }
    }

    if (x1Right.length > 0) {
        var rightUsedHeight = (y1Right[y1Right.length - 1] + (labelH * 3)) - y1Right[0];
        var rightHeight = startPositions.right.endY - startPositions.right.startY;
        /*if (!useTheseSides.up) {
            rightHeight += containerTop;
        }
        if (!useTheseSides.down) {
            rightHeight += (pageScreenHeight - containerHeight - containerTop);
        }*/
        var rightMarginX = pageScreenWidth - (containerLeft + containerWidth) -
            (labelW + globalObj.spacing.pageSpacingLeftRight);
        var rightMarginY = (rightHeight - rightUsedHeight) / 2;
        rightMarginX = isNaN(rightMarginX) ? 0 : rightMarginX;
        rightMarginY = isNaN(rightMarginY) ? 0 : rightMarginY;
        for (var i = 0; i < x1Right.length; i++) {
            x1Right[i] = Math.floor(x1Right[i] + rightMarginX);
            y1Right[i] = Math.floor(y1Right[i] + rightMarginY);
            getLabelPositions2HelperObj[x1Right[i] + ',' + y1Right[i]] = 'right';
        }
    }

    if (x1Down.length > 0) {
        var bottomWidth = pageScreenWidth;
        var bottomHeight = pageScreenHeight - containerHeight - containerTop;
        var downUsedWidth = (x1Down[x1Down.length - 1] + (labelW * 3)) - x1Down[0];
        var downMarginX = (bottomWidth - downUsedWidth) / 2;
        var downMarginY = (bottomHeight - labelH) / 2;
        downMarginY = downMarginY < 0 ? 0 : downMarginY;
        downMarginX = isNaN(downMarginX) ? 0 : downMarginX;
        downMarginY = isNaN(downMarginY) ? 0 : downMarginY;
        for (var i = 0; i < x1Down.length; i++) {
            x1Down[i] = Math.floor(x1Down[i] + downMarginX);
            y1Down[i] = Math.floor(y1Down[i] + downMarginY);
            getLabelPositions2HelperObj[x1Down[i] + ',' + y1Down[i]] = 'down';
        }
    }

    rotateHelper = 0;
    while (x1Up.length > 0 || x1Left.length > 0 || x1Right.length > 0 || x1Down.length > 0) {
        switch (rotateHelper++) {
            case 0:
                if (x1Up.length > 0) {
                    x1.push(x1Up.shift());
                    y1.push(y1Up.shift());
                }
                break;
            case 1:
                if (x1Left.length > 0) {
                    x1.push(x1Left.shift());
                    y1.push(y1Left.shift());
                }
                break;
            case 2:
                if (x1Right.length > 0) {
                    x1.push(x1Right.shift());
                    y1.push(y1Right.shift());
                }
                break;
            case 3:
                if (x1Down.length > 0) {
                    x1.push(x1Down.shift());
                    y1.push(y1Down.shift());
                }
                rotateHelper = 0;
                break;
            default:
                break;
        }
    }
    return true;
}