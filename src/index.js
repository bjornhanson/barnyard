import { Observable, Scheduler } from 'rxjs/Rx'
import _ from 'lodash'
import randomColor from 'random-color'
import getAnimal from './animals'
import sceneRenderer from './scene-renderer'
import { steer } from './keycode-handlers'
import { isCollision, isOutOfBounds, randomPoint } from './util'

const WIDTH = 500
const HEIGHT = 400
const FRAME_RATE = 60 // frames/second
const VELOCITY = 100 // pixels/second

const canvas = document.createElement('canvas')
canvas.width = WIDTH
canvas.height = HEIGHT
document.body.appendChild(canvas)

const renderScene = sceneRenderer(canvas)

const gameRate = (frameRate = 60, scheduler = Scheduler.animationFrame) =>
	Observable.interval(1000 / frameRate, scheduler).map(() => scheduler.now())

const gameRate$ = gameRate(FRAME_RATE)
const velocity$ = gameRate$
	.pairwise()
	.map(([prev, current]) => current - prev)
	.map(ms => VELOCITY * ms / 1000)
const keyCode$ = Observable.fromEvent(document, 'keydown').pluck('keyCode')
const direction$ = keyCode$.let(steer)
const vector$ = Observable.combineLatest(
	velocity$,
	direction$,
	(velocity, { x, y }) => ({
		x: velocity * x,
		y: velocity * y,
		bearing: x !== 0 ? 'H' : y !== 0 ? 'V' : '?',
	})
).sample(gameRate$)

const start$ = Observable.of(function() {
	return {
		icon: getAnimal(),
		color: randomColor().hexString(),
		alive: true,
		bearing: '?',
		points: [{ x: randomPoint(500), y: randomPoint(400) }],
	}
})
const position$ = vector$.map(
	({ x, y, bearing }) =>
		function(state) {
			const lastPos = state.points[state.points.length - 1]
			const nextPos = { x: lastPos.x + x, y: lastPos.y + y }
			if (
				state.points.length === 0 ||
				(bearing !== state.bearing && bearing !== '?')
			) {
				return {
					...state,
					bearing,
					points: state.points.concat(nextPos),
				}
			}
			return {
				...state,
				bearing,
				points: state.points.slice(0, -1).concat(nextPos),
			}
		}
)
const isNotInBounds = (width, height) => state => {
	if (state.alive) {
		const currentPos = state.points[state.points.length - 1]
		return {
			...state,
			alive: !isOutOfBounds(currentPos.x, currentPos.y, width, height),
		}
	}
	return state
}

const hasCollision = state => {
	if (state.alive) {
		const currentPos = state.points[state.points.length - 1]
		return {
			...state,
			alive:
				state.points.length <= 2 ||
				!isCollision(currentPos.x, currentPos.y, state.points.slice(0, -1)),
		}
	}
	return state
}

const stateReducers = _.flowRight(hasCollision, isNotInBounds(WIDTH, HEIGHT))

Observable.concat(start$, position$)
	.scan((state, reducer) => {
		return stateReducers(reducer(state))
	}, {})
	.subscribe(renderScene)
