import { Text } from './text.js';
import { getQuadraticCurveProgress, getQuadraticCurveTangent } from '../../lib/curves.js';

export class Koru {
    constructor() {
        this.str = 'Koru'
        this.strList = [];
        this.getListFromString();

        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');

        this.points = [];
        this.currentOffset = 0;
        this.targetOffset = 0;

        this.targetCenter = {
            x: this.sw * 0.5,
            y: this.sh * 0.5
        }
        this.currentCenter = {
            x: this.sw * 0.5,
            y: this.sh * 0.5
        }
        document.addEventListener('mousemove', this.onMove.bind(this), false);
    }

    getCanvas() {
        return this.canvas;
    }

    textChange(str) {
        this.str = str;
        this.getListFromString();

        this.targetCenter = {
            x: this.sw * 0.5,
            y: this.sh * 0.5
        }
        this.currentCenter = {
            x: this.sw * 0.5,
            y: this.sh * 0.5
        }

        this.createNewPoints();

        this.currentOffset = 0;
        this.targetOffset = this.points.length;
    }

    getListFromString() {
        this.strList = this.str.split('');
    }

    resize() {
        this.sw = this.canvas.clientWidth;
        this.sh = this.canvas.clientHeight;

        this.canvas.width = this.sw * 2;
        this.canvas.height = this.sh * 2;

        this.ctx.scale(2, 2);

        this.targetCenter = {
            x: this.sw * 0.5,
            y: this.sh * 0.5
        }
        this.currentCenter = {
            x: this.sw * 0.5,
            y: this.sh * 0.5
        }

        this.createNewPoints();

        this.currentOffset = 0;
        this.targetOffset = this.points.length;
    }

    createNewPoints() {
        this.points = [
            { x: - 0.1 * this.sw, y: 0.8 * this.sh },
            { x: - 0.1 * this.sw, y: 0.8 * this.sh },
            { x: 0, y: 0.8 * this.sh },
            { x: 0.25 * this.sw, y: 0.8 * this.sh },
        ];

        const STEPS_PER_ROTATION = 10;
        const increment = - 2 * Math.PI / STEPS_PER_ROTATION;
        let theta = Math.PI * 0.5;
        let dist = 0.2 * this.sw;
        
        this.points = [
            { x: - 0.1 * this.sw, y: 0.8 * this.sh },
            { x: - 0.1 * this.sw, y: 0.8 * this.sh },
            { x: 0, y: 0.8 * this.sh },
        ];

        const newX = this.currentCenter.x + Math.cos(theta) * dist;
        const newY = this.currentCenter.y + Math.sin(theta) * dist;

        this.points.push({
            x: newX / 2,
            y: 0.8 * this.sh
        })


        while(-theta < 5 * Math.PI) {
            const newX = this.currentCenter.x + Math.cos(theta) * dist;
            const newY = this.currentCenter.y + Math.sin(theta) * dist;
            
            this.points.push({x: newX, y: newY});

            theta = theta + increment;
            dist *= 0.9;
        }
    }

    draw(progress, elapsed) {        
        const ratio = 60 * elapsed / 1000;
        this.currentOffset += (this.targetOffset - this.currentOffset) * 0.05 * ratio;
        this.currentCenter.x += (this.targetCenter.x - this.currentCenter.x) * 0.05 * ratio;
        this.currentCenter.y += (this.targetCenter.y - this.currentCenter.y) * 0.05 * ratio;

        this.createNewPoints();

        this.ctx.clearRect(0, 0, this.sw, this.sh);
        
        for (let i = 0; i < this.points.length * 2; i++) {
            const str = this.strList[i % this.strList.length];
            this.drawText(this.points, i / 2 - this.points.length + this.currentOffset, str);
        }
    }

    drawGuide(points) {
        this.ctx.beginPath();

        points.forEach(({x, y}, index) => {
            if (index === 0) {
                this.ctx.lineTo(x, y);
                return;
            }
            const prev = points[index - 1];

            const cx = (prev.x + x) / 2;
            const cy = (prev.y + y) / 2;

            this.ctx.quadraticCurveTo(
                prev.x,
                prev.y,
                cx,
                cy
                );
        })

        this.ctx.strokeStyle = '#ff0000';
        this.ctx.stroke();
    }

    drawText(points, t, str) {
        const index = Math.floor(t);
        if (index % points.length <= 2) {
            return
        }

        const timing = t % 1;
        const p = points[index % points.length];
        const prev = points[(index - 1) % points.length];
        const prev2 = points[(index - 2) % points.length];

        const cx = (prev.x + p.x) / 2;
        const cy = (prev.y + p.y) / 2;

        const cpx = (prev2.x + prev.x) / 2;
        const cpy = (prev2.y + prev.y) / 2;

        const a = { x: cpx, y: cpy };
        const b = { x: cx, y: cy };

        const res = getQuadraticCurveProgress(
            a,
            prev,
            b,
            timing
            );
        
        const tan = getQuadraticCurveTangent(a, prev, b, timing);

        let angle = Math.atan(tan.y / tan.x);
        if (tan.x < 0) {
            angle += Math.PI
        }

        const text = new Text(str, (this.sw / 8 * Math.pow(1/1.1, t % points.length)) + 1);
        text.draw(res.x, res.y, angle, this.ctx);
    }

    onMove(e) {
        const centerX = this.sw / 2;
        const centerY = this.sh / 2;

        this.targetCenter = {
            x: (e.clientX - centerX) * 0.5 + centerX,
            y: (e.clientY - centerY) * 0.5 + centerY
        }

        const percent = ((e.clientY - centerY) * 2 / this.sh) + 0.5;
        this.targetOffset = this.points.length * 4 / 5 * percent + this.points.length / 5;

        if (centerY - this.sh * 0.25 > e.clientY) {
            this.targetOffset = this.points.length / 5;
        }
        else if (centerY + this.sh * 0.25 < e.clientY) {
            this.targetOffset = this.points.length;
        }

    }
}
