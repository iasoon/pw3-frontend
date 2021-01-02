import * as PIXI from 'pixi.js';

export class Visualizer {
    application: PIXI.Application;

    constructor(view: HTMLCanvasElement) {
        this.application = new PIXI.Application({view: view});
        this.application.renderer.backgroundColor = 0xFFFFFF;
    }

    render(gameState: GameState) {
        const playerFilters: {[id: number]: PIXI.filters.ColorMatrixFilter} = {
            1: rgbColorFilter([200, 0, 0]),
            2: rgbColorFilter([0, 0, 200]),
        }
        const app = this.application;
        app.stage.removeChildren();

        const sceneBox = boundingBox(gameState.planets);
    
        const padding = 75;
        const stageW = app.renderer.width - 2*padding;
        const stageH = app.renderer.height - 2*padding;
    
        const planetTexture = PIXI.Texture.from('/assets/images/earth.svg');
        const rocketTexture = PIXI.Texture.from('/assets/images/rocket.svg');
        const font = PIXI.BitmapFont.from("LabelFont", {
            fontSize: 12,
        });
    
        const scale = Math.min((stageW / sceneBox.w), (stageH / sceneBox.h));
    
        const planetMap: { [planetName: string]: Planet } = {};
    
        gameState.planets.forEach((planet: Planet) => {
            planetMap[planet.name] = planet;

            const planetContainer = new PIXI.Container();
    
            const sprite = new PIXI.Sprite(planetTexture);
            sprite.anchor.set(0.5);
            sprite.x = padding + (planet.x - sceneBox.x) * scale;
            sprite.y = padding + (planet.y - sceneBox.y) * scale;
            sprite.width = 50;
            sprite.height = 50;
            planetContainer.addChild(sprite);

            const label = new PIXI.BitmapText(planet.name, {
                fontName: "LabelFont",
            });
            label.anchor = 0.5;
            label.x = sprite.x;
            label.y = sprite.y + 35;
            planetContainer.addChild(label);

            const shipCount = new PIXI.BitmapText(
                planet.ship_count.toString(),
                { fontName: "LabelFont" },
            );
            shipCount.anchor = 0.5;
            shipCount.x = sprite.x;
            shipCount.y = sprite.y + 50;
            planetContainer.addChild(shipCount);
            
            if (planet.owner) {
                planetContainer.filters = [ playerFilters[planet.owner] ];
            }
            app.stage.addChild(planetContainer);
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

            const expeditionContainer = new PIXI.Container();
    
            const rocket = PIXI.Sprite.from(rocketTexture);
            rocket.anchor.set(0.5);
            rocket.width = 30;
            rocket.height = 30;
            rocket.x = padding + (x - sceneBox.x) * scale;
            rocket.y = padding + (y - sceneBox.y) * scale;
            rocket.rotation = angle;
            expeditionContainer.addChild(rocket);

            const shipCount = new PIXI.BitmapText(
                exp.ship_count.toString(),
                { fontName: "LabelFont", tint: 0xFF0000},
            );
            shipCount.anchor = 0.5;
            shipCount.x = rocket.x;
            shipCount.y = rocket.y + 30;
            expeditionContainer.addChild(shipCount);

            expeditionContainer.filters = [ playerFilters[exp.owner] ];
            app.stage.addChild(expeditionContainer);
        });
    
    }
}

function rgbColorFilter(rgb: number[]): PIXI.filters.ColorMatrixFilter {
    const filter = new PIXI.filters.ColorMatrixFilter();
    filter.matrix = [
        0, 0, 0, 0, rgb[0] / 255,
        0, 0, 0, 0, rgb[1] / 255,
        0, 0, 0, 0, rgb[2] / 255,
        0, 0, 0, 1, 0,
    ];
    return filter;
}

export function drawState(view: HTMLCanvasElement, gameState: any) {
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
    owner: number,
    destination: string,
    turns_remaining: number,
}

type GameState = {
    planets: Planet[],
    expeditions: Expedition[],
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