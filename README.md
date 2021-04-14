# domaparte-react

## For development
  - docker build -f Dockerfile --target development -t domaparte/react:development .
  - docker run --init --rm -v $(pwd):/app -p 3000:3000 -p 5000:5000 -it --entrypoint=/bin/sh domaparte/react:development
  - check you are in app folder and then do:
    - npm install
    - npm run start
    - open your browser to localhost:3000 (or the url of your vm:3000)
  - But you can also build and serve the production version:
    - npm install (if not done before)
    - npm run build
    - serve -s build
    - open your browser to localhost:5000 (or the url of your vm:5000)

## For production
  - docker build -f Dockerfile --target production -t domaparte/react:production .
  - docker run --init --rm -p 80:80 domaparte/react:production

## For lint
  - docker build -f Dockerfile --target lint -t domaparte/react:lint .
  - docker run --init --rm domaparte/react:lint
