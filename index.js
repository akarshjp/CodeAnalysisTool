const {Configuration, OpenAIApi} = require('openai');
const express = require('express');
//const bodyParser = require('body-parser');
//const cors = require('cors');
require('dotenv').config()

// Set up your OpenAI API key
//const api_key = "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";
const configuration = new Configuration({apiKey: process.env.API_KEY});
const openai = new OpenAIApi(configuration);

const app = express();
//app.use(bodyParser.json());
//app.use(cors());

// Enter the code which needs to be reviewed 
const codeReview = `#include <iostream>
using namespace std;

int main()
{
     int n, num, digit, rev = 0;

     cout << "Enter a positive number: ";
     cin >> num;

     n = num;

     do
     {
         digit = num % 10;
         rev = (rev * 10) + digit;
         num = num / 10;
     } while (num != 0);

     cout << " The reverse of the number is: " << rev << endl;

     if (n == rev)
         cout << " The number is a palindrome.";
     else
         cout << " The number is not a palindrome.";

    return 0;
}?`

// Enter the code for which you need the quality
const codeQuality = `// BFS algorithm in C++

#include <iostream>
#include <list>

using namespace std;

class Graph {
  int numVertices;
  list<int>* adjLists;
  bool* visited;

   public:
  Graph(int vertices);
  void addEdge(int src, int dest);
  void BFS(int startVertex);
};

// Create a graph with given vertices,
// and maintain an adjacency list
Graph::Graph(int vertices) {
  numVertices = vertices;
  adjLists = new list<int>[vertices];
}

// Add edges to the graph
void Graph::addEdge(int src, int dest) {
  adjLists[src].push_back(dest);
  adjLists[dest].push_back(src);
}

// BFS algorithm
void Graph::BFS(int startVertex) {
  visited = new bool[numVertices];
  for (int i = 0; i < numVertices; i++)
    visited[i] = false;

  list<int> queue;

  visited[startVertex] = true;
  queue.push_back(startVertex);

  list<int>::iterator i;

  while (!queue.empty()) {
    int currVertex = queue.front();
    cout << "Visited " << currVertex << " ";
    queue.pop_front();

    for (i = adjLists[currVertex].begin(); i != adjLists[currVertex].end(); ++i) {
      int adjVertex = *i;
      if (!visited[adjVertex]) {
        visited[adjVertex] = true;
        queue.push_back(adjVertex);
      }
    }
  }
}

int main() {
  Graph g(4);
  g.addEdge(0, 1);
  g.addEdge(0, 2);
  g.addEdge(1, 2);
  g.addEdge(2, 0);
  g.addEdge(2, 3);
  g.addEdge(3, 3);

  g.BFS(2);

  return 0;
}
?`
// console.log(codeToEvaluate);
// Define the parameters for the code quality evaluation API 
 app.post('/quality', (req, res) => {
  const response = openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `code quality in percentage for the following code:  :\n ${codeQuality}`,
    temperature: 0,
    max_tokens: 2048,
    n: 1,
    stop: '?'
})

  response.then((data) => {
    res.send({quality: data.data.choices[0].text});

    // const qualityScore = response.data.choices[0].text;
    // console.log(`The quality of the code is: ${qualityScore}`);
  })
});

app.post('/review', (req, res) => {
  const response = openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `Use code review practices and provide a review of following: \n ${codeReview}`,
    temperature: 0,
    max_tokens: 1024,
    n: 1,
    stop: '?'
})

  response.then((data) => {
    res.send({review: data.data.choices[0].text});

    // const qualityScore = response.data.choices[0].text;
    // console.log(`The quality of the code is: ${qualityScore}`);
  })
});

app.listen(3000, () =>{
    console.log("Server running on port 3000");
})