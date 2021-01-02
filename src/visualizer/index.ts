import * as PIXI from 'pixi.js';

export function init(view: HTMLCanvasElement) {
    const app = new PIXI.Application({view: view});
    app.renderer.backgroundColor = 0xFFFFFF;
    return app
}

export function drawState(view: HTMLCanvasElement, gameState: any) {
    const app = init(view);
    const sceneBox = boundingBox(gameState.planets);
    
    const padding = 50;
    const stageW = app.renderer.width - 2*padding;
    const stageH = app.renderer.height - 2*padding;

    const planetTexture = PIXI.Texture.from('/assets/images/earth.svg');
    const rocketTexture = PIXI.Texture.from('/assets/images/rocket.svg');

    const scale = Math.min((stageW / sceneBox.w), (stageH / sceneBox.h));

    const planetMap: { [planetName: string]: Planet } = {};

    gameState.planets.forEach((planet: Planet) => {
        planetMap[planet.name] = planet;

        const sprite = new PIXI.Sprite(planetTexture);
        sprite.anchor.set(0.5);
        sprite.x = padding + (planet.x - sceneBox.x) * scale;
        sprite.y = padding + (planet.y - sceneBox.y) * scale;
        sprite.width = 50;
        sprite.height = 50;
        app.stage.addChild(sprite);
    });

    gameState.expeditions.forEach((exp: Expedition) => {
        const origin = planetMap[exp.origin];
        const destination = planetMap[exp.destination];
        
        const dist = Math.ceil(distance(origin, destination));
        
        const dx = destination.x - origin.x;
        const dy= destination.y - origin.y;
        const angle = Math.atan2(dy, dx) + Math.PI / 4;
        const f = 1 - (exp.turns_remaining / dist);
        const x = origin.x + f * dx;
        const y = origin.y + f * dy;

        const rocket = PIXI.Sprite.from(rocketTexture);
        rocket.anchor.set(0.5);
        rocket.width = 30;
        rocket.height = 30;
        rocket.x = padding + (x - sceneBox.x) * scale;
        rocket.y = padding + (y - sceneBox.y) * scale;
        rocket.rotation = angle;
        app.stage.addChild(rocket);
    });
}

function boundingBox(objs: HasCoords[]): Rect {
    const xs = objs.map(obj => obj.x);
    const ys = objs.map(obj => obj.y);
    const x = Math.min(...xs);
    const w = Math.max(...xs) - x;
    const y = Math.min(...ys);
    const h = Math.max(...ys) - y;
    return { x, y, w, h };
}

function distance(a: HasCoords, b: HasCoords): number {
    return Math.sqrt(
        Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2)
    );
}

type Planet = {
    name: string,
    x: number,
    y: number,
    ship_count: number,
    owner?: number,
}

type Expedition = {
    id: number,
    ship_count: number,
    origin: string,
    destination: string,
    turns_remaining: number,
}

type HasCoords = {
    x: number,
    y: number,
}

type Rect = {
    x: number,
    y: number,
    w: number,
    h: number,
}