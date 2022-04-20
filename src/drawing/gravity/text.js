export class Text {
    constructor(x, y, str, measurement) {
        this.str = str;

        this.measurement = measurement;

        const left = x - measurement.actualBoundingBoxLeft;
        const top = y - measurement.actualBoundingBoxAscent;

        this.w = measurement.actualBoundingBoxRight + measurement.actualBoundingBoxLeft;
        this.h = measurement.actualBoundingBoxAscent + measurement.actualBoundingBoxDescent;

        this.x = x;
        this.y = y;

        this.centerX = left + this.w / 2;
        this.centerY = top + this.h / 2;

        this.vx = 0;
        this.vy = 0;

        this.rotation = 0.0;
        this.rotationV = 0.2;

        this.ax = 0;
        this.ay = 1200;

        this.isStationary = false;
    }

    update(ratio) {
        this.x += this.vx * ratio;
        this.y += this.vy * ratio;
        this.centerX += this.vx * ratio;
        this.centerY += this.vy * ratio;

        this.vx += this.ax * ratio;
        this.vy += this.ay * ratio;

        this.vy *= 0.999

        // this.rotation += this.rotationV * ratio;
        if (this.rotation > 1) {
            this.rotation -= 1;
        }
        else if (this.rotation < -1) {
            this.rotation += 1;
        }
    }

    getCollisionBox() {
        // const bottomRight = {
        //     x: this.centerX + ((this.w / 2) * Math.cos(2 * Math.PI * this.rotation)) - ((this.h / 2) * Math.sin(2 * Math.PI * this.rotation)),
        //     y: this.centerY + ((this.w / 2) * Math.sin(2 * Math.PI * this.rotation)) + ((this.h / 2) * Math.cos(2 * Math.PI * this.rotation))
        // }
        
        // const bottomLeft = {
        //     x: this.centerX - ((this.w / 2) * Math.cos(2 * Math.PI * this.rotation)) - ((this.h / 2) * Math.sin(2 * Math.PI * this.rotation)),
        //     y: this.centerY - ((this.w / 2) * Math.sin(2 * Math.PI * this.rotation)) + ((this.h / 2) * Math.cos(2 * Math.PI * this.rotation)) 
        // }

        // const topLeft = {
        //     x: this.centerX - ((this.w / 2) * Math.cos(2 * Math.PI * this.rotation)) + ((this.h / 2) * Math.sin(2 * Math.PI * this.rotation)),
        //     y: this.centerY - ((this.w / 2) * Math.sin(2 * Math.PI * this.rotation)) - ((this.h / 2) * Math.cos(2 * Math.PI * this.rotation))
        // }

        // const topRight = {
        //     x: this.centerX + ((this.w / 2) * Math.cos(2 * Math.PI * this.rotation)) + ((this.h / 2) * Math.sin(2 * Math.PI * this.rotation)), 
        //     y: this.centerY + ((this.w / 2) * Math.sin(2 * Math.PI * this.rotation)) - ((this.h / 2) * Math.cos(2 * Math.PI * this.rotation))
        // }

        return {
            x: this.centerX,
            y: this.centerY,
            w: this.w,
            h: this.h,
            rotation: this.rotation,
            // polygonList: [
            //     topLeft, topRight, bottomRight, bottomLeft
            // ]
        }   
    }

    draw(ctx, {
        wireframe
    } = { wireframe: false }) {
        ctx.save();
        ctx.translate(
            this.centerX,
            this.centerY
        );
        ctx.rotate(this.rotation * Math.PI * 2);
        
        ctx.fillText(this.str,
            this.x - this.centerX,
            this.y - this.centerY
            );
         
        if (wireframe) {
            ctx.beginPath();
            ctx.fillStyle = '#ff0000';
            ctx.arc(
                0,
                0,
                1,
                0,
                2* Math.PI
            )
            ctx.fill();
        }
        
        ctx.restore();

        if (wireframe) {
            const collisionBox = this.getCollisionBox();
            ctx.save();
            ctx.translate(collisionBox.x, collisionBox.y);
            ctx.rotate(this.rotation * Math.PI * 2);
            ctx.beginPath();
            ctx.moveTo(- collisionBox.w / 2, - collisionBox.h / 2);
            ctx.lineTo(+ collisionBox.w / 2, - collisionBox.h / 2);
            ctx.lineTo(+ collisionBox.w / 2, + collisionBox.h / 2);
            ctx.lineTo(- collisionBox.w / 2, + collisionBox.h / 2);
            ctx.lineTo(- collisionBox.w / 2, - collisionBox.h / 2);
            ctx.strokeStyle = '#ff0000';
            ctx.stroke();

            ctx.restore();
        }
    }
}