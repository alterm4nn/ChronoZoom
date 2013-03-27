var ChronoZoom;
(function (ChronoZoom) {
    (function (Viewport) {
        function VisibleRegion2d(centerX, centerY, scale) {
            this.centerX = centerX;
            this.centerY = centerY;
            this.scale = scale;
        }
        Viewport.VisibleRegion2d = VisibleRegion2d;
        function Viewport2d(aspectRatio, width, height, visible) {
            this.aspectRatio = aspectRatio;
            this.visible = visible;
            this.width = width;
            this.height = height;
            this.widthScreenToVirtual = function (wp) {
                return this.visible.scale * wp;
            };
            this.heightScreenToVirtual = function (hp) {
                return this.aspectRatio * this.visible.scale * hp;
            };
            this.widthVirtualToScreen = function (wv) {
                return wv / this.visible.scale;
            };
            this.heightVirtualToScreen = function (hv) {
                return hv / (this.aspectRatio * this.visible.scale);
            };
            this.vectorVirtualToScreen = function (vx, vy) {
                return {
                    x: vx / this.visible.scale,
                    y: vy / (this.aspectRatio * this.visible.scale)
                };
            };
            this.pointVirtualToScreen = function (px, py) {
                return {
                    x: (px - this.visible.centerX) / this.visible.scale + this.width / 2.0,
                    y: (py - this.visible.centerY) / (this.aspectRatio * this.visible.scale) + this.height / 2.0
                };
            };
            this.pointScreenToVirtual = function (px, py) {
                return {
                    x: (px - this.width / 2.0) * this.visible.scale + this.visible.centerX,
                    y: this.visible.centerY - (this.height / 2.0 - py) * (this.aspectRatio * this.visible.scale)
                };
            };
            this.vectorScreenToVirtual = function (px, py) {
                return {
                    x: px * this.visible.scale,
                    y: this.aspectRatio * this.visible.scale * py
                };
            };
        }
        Viewport.Viewport2d = Viewport2d;
    })(ChronoZoom.Viewport || (ChronoZoom.Viewport = {}));
    var Viewport = ChronoZoom.Viewport;
})(ChronoZoom || (ChronoZoom = {}));
