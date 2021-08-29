const login = document.getElementById('loginform')
login.addEventListener('submit', loginUser)

async function loginUser(event)
{
	event.preventDefault()
	const username = document.getElementById('username').value
	const password = document.getElementById('password').value

	const result = await fetch('/api/login', 
	{
		method: 'POST',
		headers: 
		{
			'Content-Type': 'application/json; charset=utf-8'
		},
		body: JSON.stringify
		({
			username,
			password
		})
	})
}

const register = document.getElementById('registerform')
register.addEventListener('submit', registerUser)

async function registerUser(event)
{
	event.preventDefault()
	const username = document.getElementById('username').value
	const password = document.getElementById('password').value
	const firstName = document.getElementById('firstName').value
	const lastName = document.getElementById('lastName').value
	const email = document.getElementById('email').value

	const result = await fetch('/api/register', 
	{
		method: 'POST',
		headers: 
		{
			'Content-Type': 'application/json; charset=utf-8'
		},
		body: JSON.stringify
		({
			username,
			password,
			fistName,
			lastName,
			email
		})
	})
}


