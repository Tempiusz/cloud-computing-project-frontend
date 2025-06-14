ClothCloud is a cloud-based platform designed to streamline clothing inventory management, enabling users to efficiently organize, track, and analyze their wardrobe or retail stock.

# cloud-computing-project-frontend

## Login and register
You can register and login.
You can check whether you are logged or not by inspect>application>local storage
If you see a token - it's your logged user token - it means your are logged in this session

If you open the same address "localhost:xxxx/listings" in incognito the token will not be there, bcs it's not the same session so it means it's working fine.

## How to turn on the server and page
1. Go `cloud-computing-project-backend` 
2. Open project catalogue
3. Create .env file (needed content of this file is writed down backend project readme file)
4. Make a venv `python -m venv venv`
5. Activate venv `venv\Scripts\activate`
6. Install needed libraries `pip install -r requirements.txt`
7. Turn on the server `uvicorn main:app --reload`

Now you can turn on the frontend `npm run dev` in second terminal and it should be working