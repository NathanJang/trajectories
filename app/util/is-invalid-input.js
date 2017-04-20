var format = /^ *[+\-]?\d+\.?\d*([eE][+\-]?\d+)? *$/;

export default function (input) {
  return Boolean(typeof input === 'string' && !input.match(format));
}

var formatString = format.toString().substr(1, 1);

export {format, formatString};
