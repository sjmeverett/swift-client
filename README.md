
# Swift Client

This library is for connecting to an OpenStack Swift storage server.

## Installation

    $ npm install --save swift-client

## Documentation

The main class is `SwiftClient`, which can be imported as follows:

```js
import SwiftClient from 'swift-client';
```

Or...

```js
const SwiftClient = require('swift-client');
```

I'm just going to use ES2016 (with async and await) for brevity in this document.

### Authenticating

The first task is to authenticate, thus creating a `SwiftClient` instance:

```js
let client = await SwiftClient.create('https://orbit.brightbox.com/v1/acc-xxxxx',
  'cli-xxxxx', 'mysupersecretpassword');
```



### `SwiftClient` class


#### `SwiftClient.create(url, username, password)`

Creates an instance of `SwiftClient` with the specified authentication information.

| Argument | Description |
|----------|-------------|
| `url` | the URL of the server |
| `username` | the username to authenticate with |
| `password` | the password to authenticate with |


#### `SwiftClient#list()`

Gets an array of containers.

**Example**

```js
await client.list();

/* returns:
[
  {name: 'container-name', count: 123, bytes: 12438468},
  ...
]
*/
```


#### `SwiftClient#create(name, publicRead, meta, extra)`

Creates a container.

| Argument | Description |
|----------|-------------|
| `name` | the name of the container to create |
| `publicRead` | true if the container is to be publicly readable; otherwise, false (optional) |
| `meta` | a hash of meta information to set on the container (optional) |
| `extra` | a hash of additional headers to send (optional) |


**Example**

```js
await client.create('my-container', true, {colour: 'blue'});
```


#### `SwiftClient#update(name, meta, extra)`

Updates the metadata associated with the specified container.

| Argument | Description |
|----------|-------------|
| `name` | the name of the container to update |
| `meta` | a hash of meta information to set on the container |
| `extra` | a hash of additional headers to send (optional) |


**Example**

```js
await client.update('my-container', {colour: 'red'});
```


#### `SwiftClient#meta(name)`

Gets the metadata associated with the specified container.

| Argument | Description |
|----------|-------------|
| `name` | the name of the container to get the metadata for |


**Example**

```js
let meta = await client.meta('my-container');

/*
meta is a hash of metadata, e.g.
{
  colour: 'red'
}
*/
```


#### `SwiftClient#delete(name)`

Deletes the specified container.

| Argument | Description |
|----------|-------------|
| `name` | the name of the container to delete |


**Example**

```js
await client.delete('my-container');
```


#### `SwiftClient#container(name)`

Gets an instance of `SwiftContainer` for the specified container.

| Argument | Description |
|----------|-------------|
| `name` | the name of the container to get a `SwiftContainer` instance for |

**Example**

```js
let container = client.container('my-container');
```


### `SwiftContainer` class

#### `SwiftContainer#list()`

Gets an array of objects in the container.

**Example**

```js
await client.list();

/* returns:
[
  {name: 'container-name', count: 123, bytes: 12438468},
  ...
]
*/
```


#### `SwiftContainer#create(name, stream, meta, extra)`

Creates an object.

| Argument | Description |
|----------|-------------|
| `name` | the name of the object to create |
| `stream` | a stream representing the file to upload |
| `meta` | a hash of meta information to set on the object (optional) |
| `extra` | a hash of additional headers to send (optional) |


**Example**

```js
let stream = fs.createReadStream('darkness-at-noon.txt');

await container.create('books/darkness-at-noon.txt',
  stream, {author: 'Arthur Koestler'});
```



#### `SwiftContainer#get(name, stream)`

Gets an object.

| Argument | Description |
|----------|-------------|
| `name` | the name of the object to get |
| `stream` | a stream to pipe the object to |


**Example**

```js
let stream = fs.createWriteStream('darkness-at-noon.txt');
await container.get('books/darkness-at-noon.txt', stream);
```


#### `SwiftContainer#update(name, meta, extra)`

Updates the metadata associated with the specified object.

| Argument | Description |
|----------|-------------|
| `name` | the name of the object to update |
| `meta` | a hash of meta information to set on the object |
| `extra` | a hash of additional headers to send (optional) |


**Example**

```js
await container.update('books/darkness-at-noon.txt', {year: '1940'});
```


#### `SwiftContainer#meta(name)`

Gets the metadata associated with the specified object.

| Argument | Description |
|----------|-------------|
| `name` | the name of the object to get the metadata for |


**Example**

```js
let meta = await container.meta('books/darkness-at-noon.txt');

/*
meta is a hash of metadata, e.g.
{
  author: 'Arthur Koestler',
  year: '1940'
}
*/
```


#### `SwiftContainer#delete(name, when)`

Deletes the specified object.  If `when` is a `Date`, the object is deleted at that date; if it is a number, the object is deleted after that many seconds; or if it is ommitted, the object is deleted immediately.

| Argument | Description |
|----------|-------------|
| `name` | the name of the object to delete |
| `when` | a `Date` representing when the object is to be deleted, or a number of seconds the object is to be deleted after (optional) |


**Example**

```js
// delete the object in 2 minutes time
await container.delete('books/darkness-at-noon.txt', 120);
```
