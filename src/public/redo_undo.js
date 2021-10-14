class UndoRedoHandler {
	constructor(currentstate) {
		this._undoStack = [];
		this._redoStack = [];
		let arr = [];
		for (let i = 0; i < currentstate.length; ++i) {
			arr.push({
				content: currentstate[i].firstChild.data,
				color: currentstate[i].style.color,
				background: currentstate[i].style.backgroundColor,
			});
		}
		this._redoStack.push(arr);
	}

	insert(state) {
		this._undoStack.push(this._redoStack.pop());
		this._redoStack.length = 0;
		let arr = [];
		for (let i = 0; i < state.length; ++i) {
			arr.push({
				content: state[i].firstChild.data,
				color: state[i].style.color,
				background: state[i].style.backgroundColor,
			});
		}
		this._redoStack.push(arr);
	}

	getPrevState() {
		if (this._undoStack.length >= 1) {
			let state = this._undoStack.pop();
			this._redoStack.push(state);
			return state;
		}
	}

	getNextState() {
		if (this._redoStack.length >= 2) {
			let state = this._redoStack.pop();
			this._undoStack.push(state);
			return this._redoStack[this._redoStack.length - 1];
		}
	}

	clear() {
		if (this._redoStack.length >= 1) {
			let state = this._redoStack.pop();
			this._undoStack.length = 0;
			this._redoStack.length = 0;
			this._redoStack.push(state);
		}
	}
}
