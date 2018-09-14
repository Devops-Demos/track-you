const arr = [{
  'key1': 'abc',
  'key2': '1'
},
{
  'key1': 'def',
  'key2': '2'
}];

const obj = arr.reduce((acc, v) => {
  return {
   'a': v
  }
}, 
{})

console.log(obj)