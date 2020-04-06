const ADD_TODO = "ADD_TODO"
const REMOVE_TODO = "REMOVE_TODO"
const TOGGLE_TODO = "TOGGLE_TODO"
const ADD_GOAL = "ADD_GOAL"
const REMOVE_GOAL = "REMOVE_GOAL"

function generateId () {
    return Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36);
}
function createStore (reducer) {

	let state 
	let listeners = []
	const getState = () => state
	const subscribe = (listener) => {
		listeners.push(listener)
		return () => {
			listeners = listeners.filter((l) => l != listener)
		}
	}

	const dispatch = (action) => {
		state = reducer(state, action) 
		listeners.forEach((l) => l())
	}

	return {
		getState, 
		subscribe,
		dispatch
	}
}

function addTodoAction (todo) {
	return {
		type: ADD_TODO, 
		todo,
	}
}

function removeTodoAction (id) {
	return {
		type: REMOVE_TODO, 
		id,
	}
}

function toggleTodoAction (id) {
	return {
		type: TOGGLE_TODO, 
		id
	}
}

function addGoalAction (goal) {
	return {
		type : ADD_GOAL, 
		goal, 
	}
}

function removeGoalAction (id) {
	return {
		type: REMOVE_GOAL, 
		id
	}
}

function todos(state = [], action) {
	switch(action.type) {
		case ADD_TODO :
			return state.concat([action.todo])
		case REMOVE_TODO :
			return state.filter((todo) => todo.id != action.id)
		case TOGGLE_TODO :
			return state.map((todo) => todo.id != action.id ? todo: Object.assign({}, todo, {complete: !todo.complete}))
		 default:
			return state
	}
}

function goals(state = [], action) {
	switch(action.type) {
		case ADD_GOAL :
			return state.concat([action.goal])
		case REMOVE_GOAL :
			return state.filter((goal) => goal.id != action.id)
		 default:
			return state
	}
}

function app (state = {}, action) {
	return {
		todos: todos(state.todos, action),
		goals: goals(state.goals, action)
	}
}

function addTodo () {
	const input = document.getElementById('todo')
	const name = input.value 
	input.value = ''

	store.dispatch(addTodoAction({
		name, 
		complete: false,
		id: generateId()

	}))
}

function addGoal () {
	const input = document.getElementById('goal')
	const name = input.value 
	input.value = ''

	store.dispatch(addGoalAction({
		id: generateId(),
		name
	}))
}


function addTodoToDOM (todo) {
	const node = document.createElement('li')
	const text = document.createTextNode(todo.name)

	const removeBtn = createRemoveButton( () => {
		store.dispatch(removeTodoAction(todo.id))
	})

	node.appendChild(text)
	node.appendChild(removeBtn)

	document.getElementById('todos').append(node)
	node.style.textDecoration = todo.complete ? 'line-through' : 'none'
	node.addEventListener('click', () => {
		store.dispatch(toggleTodoAction(todo.id))
	})
}

function addGoalToDOM (goal) {
	const node = document.createElement('li')
	const text = document.createTextNode(goal.name)
	node.appendChild(text)
	document.getElementById('goals').append(node)
}



function createRemoveButton (onClick) {
	const removeBtn = document.createElement('button')
	removeBtn.innerHTML = 'X'
	removeBtn.addEventListner('click', onClick)
	return removeBtn
}

const store = createStore(app)
store.subscribe(() => {
	const { goals, todos } = store.getState()

	document.getElementById('goals').innerHTML = ''
	document.getElementById('todos').innerHTML = ''
	goals.forEach(addGoalToDOM)
	todos.forEach(addTodoToDOM)
})

document.getElementById('todoBtn').addEventListener('click', addTodo)
document.getElementById('goalBtn').addEventListener('click', addGoal)
