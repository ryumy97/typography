import { doPolygonsIntersect } from './helper.js'

export class World {
    constructor() {
        this.list = [];
        this.wireframe = false;
    }

    add(...obj) {
        this.list.push(...obj);
    }

    removeAll() {
        this.list = [];
    }

    update(elapsed, ctx) {
        this.updateMovement(elapsed);
        this.colisionFix(ctx);
    }

    updateMovement(elapsed) {
        this.list.forEach(_ => {
            _.update(elapsed);
        })
    }

    colisionFix(ctx) {
        const length = this.list.length;
        console.log('collisionCheck')
        for(let i = 0; i < length; i++) {
            const boxA = this.list[i];
            const collisionBoxA = boxA.getCollisionBox(ctx);
            for (let j = i + 1; j < length; j++) {
                const boxB = this.list[j];
                const collisionBoxB = boxB.getCollisionBox(ctx);

                const flag = doPolygonsIntersect(collisionBoxA.polygonList, collisionBoxB.polygonList);
                console.log(flag);
                if (flag) {
                    if (!boxA.isStationary) {
                        boxA.vx *= -0.9;
                        boxA.vy *= -0.9;
                        
                        // boxA.rotationV *= -1;
                    }
                    if (!boxB.isStationary) {
                        boxB.vx *= -0.9;
                        boxB.vy *= -0.9;
                        // boxB.rotationV *= -1;
                    }
                }
            }
        }
    }

    draw(ctx) {
        this.list.forEach(_ => {
            _.draw(ctx, {
                wireframe:this.wireframe
            });
        })
    }
}