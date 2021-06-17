import axios from 'axios';


export default async function AccessCooperDM({ query }, res) {
	const { code } = query;
	const result = { success: false, token: null };

	if (code) {
		try {
			// Check if 

			const token = {
				created_by: 'cooper_dm'
			}

			

			// Validate.
			result.token = token;
			result.success = true;

		} catch (error) {
			// NOTE: An unauthorized token will not throw an error;
			// it will return a 401 Unauthorized response in the try block above
			console.error(error);
			
            // TODO: Add the error that will not be thrown to handle in one catch?

			result.success = false;
			result.error = error.message;
		}
	}
	
	// TODO: Figure out what the user is actually sent at this stage?
	res.status(200).json(result);
}