FROM mhart/alpine-node
ADD package.json .
RUN npm install
ADD components components
ADD src src
CMD ["node", "--harmony", "src/index.js"]
