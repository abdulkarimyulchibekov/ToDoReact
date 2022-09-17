import {
	Button,
	ButtonGroup,
	Checkbox,
	IconButton,
	Modal,
	TextField,
} from '@mui/material';
import { useState } from 'react';
import DrawerAppBar from './components/Appbar';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Box } from '@mui/system';
import { useEffect } from 'react';

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 400,
	bgcolor: '#ddd',
	border: '2px solid #000',
	boxShadow: 24,
	p: 4,
};

function App() {
	const localData = JSON.parse(localStorage.getItem('list'));
	const localId = JSON.parse(localStorage.getItem('id'));
	let [count, setCount] = useState(localId || 0);
	const [todo, setTodo] = useState(localData || []);
	const [list, setList] = useState([]);
	const [func, setFunc] = useState('');
	const handleListAdd = (evt) => {
		if (evt.code === 'Enter') {
			setTodo([
				{
					data: evt.target.value,
					id: count,
					checked: false,
				},
				...todo,
			]);
			evt.target.value = '';
			setList([...todo]);
			setCount(count + 1);
		}
	};
	localStorage.setItem('id', JSON.stringify(count));
	localStorage.setItem('list', JSON.stringify(todo));

	const [open, setOpen] = useState({
		isOpen: false,
		data: '',
		id: null,
	});
	const handleClose = () => setOpen(false);

	const handleListEdit = (evt) => {
		if (evt.code === 'Enter') {
			todo[open.id].data = evt.target.value;
			handleClose();
		}
	};
	const handleAll = () => {
		setList([...todo]);
		setFunc('all');
	};
	const handleCompleted = () => {
		setList(todo.filter((e) => e.checked === true));
		setFunc('completed');
	};
	const handleUncompleted = () => {
		setList(todo.filter((e) => e.checked !== true));
		setFunc('uncompleted');
	};

	useEffect(() => {
		if (func === 'all') {
			handleAll();
		} else if (func == 'completed') {
			handleCompleted();
		} else if (func === 'uncompleted') {
			handleUncompleted();
		}
	}, [todo]);

	return (
		<div className='App'>
			<DrawerAppBar />

			<div
				style={{
					marginTop: 100,
					marginLeft: 'auto',
					marginRight: 'auto',
					width: 200,
				}}>
				<TextField
					onKeyUp={handleListAdd}
					id='outlined-basic'
					label='Add Your Task'
					required
					autoComplete='off'
					variant='outlined'
					style={{ marginBottom: 30 }}
				/>
			</div>

			<ButtonGroup
				style={{
					width: 377,
					marginLeft: 'auto',
					marginRight: 'auto',
					textAlign: 'center',
					display: 'flex',
				}}
				variant='contained'
				aria-label='outlined primary button group'>
				<Button onClick={handleAll}>All Tasks</Button>
				<Button onClick={handleCompleted}>Completed</Button>
				<Button onClick={handleUncompleted}>Uncompleted</Button>
			</ButtonGroup>

			{list.length ? (
				<ul
					style={{
						display: 'flex',
						alignItems: 'center',
						flexDirection: 'column',
						margin: 0,
						padding: 0,
						listStyle: 'none',
						width: '100%',
						marginBottom: 50,
					}}>
					{list.map((e, index) => (
						<li
							style={{
								background: '#bbb',
								marginTop: 30,
								paddingTop: 20,
								paddingLeft: 20,
								paddingBottom: 20,
								paddingRight: 30,
								width: '50%',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'space-between',
							}}
							key={e.id}>
							<span
								style={
									e.checked === true
										? { textDecoration: 'line-through', width: 500 }
										: { textDecoration: 'none', width: 500 }
								}>
								{e.data}
							</span>
							<div>
								<Checkbox
									defaultChecked={e.checked}
									onChange={(evt) => {
										e.checked = evt.target.checked;
										setTodo([...todo]);
										localStorage.setItem('list', JSON.stringify(todo));
									}}
								/>
								<IconButton
									onClick={() => {
										const deletedTodo = todo.splice(index, 1);
										setTodo(todo.filter((e) => e.id !== deletedTodo.id));
									}}>
									<DeleteIcon />
								</IconButton>
								<IconButton
									onClick={() =>
										setOpen({
											isOpen: true,
											data: e.data,
											id: index,
										})
									}>
									<EditIcon />
								</IconButton>
							</div>
						</li>
					))}
				</ul>
			) : (
				<p
					style={{
						textAlign: 'center',
						fontSize: 48,
						color: '#999',
					}}>
					There will be your to do list
				</p>
			)}

			<Modal
				open={open.isOpen}
				onClose={handleClose}
				aria-labelledby='modal-modal-title'
				aria-describedby='modal-modal-description'>
				<Box sx={style}>
					<TextField
						onKeyUp={handleListEdit}
						id='outlined-basic'
						label='Edit Your Task'
						variant='outlined'
						defaultValue={open.data}
					/>
				</Box>
			</Modal>
		</div>
	);
}

export default App;
