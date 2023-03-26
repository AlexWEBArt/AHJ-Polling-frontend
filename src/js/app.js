import {
  catchError, of,
} from 'rxjs';
// import { Observable, map, interval } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import CreateNewMessage from './CreateNewMessage';

import background from '../img/cell.jpg';

document.querySelector('body').style.backgroundImage = `url(${background})`;

const mailBox = document.querySelector('.container-mail');

const message = new CreateNewMessage(mailBox);

// const stream$ = new Observable( (observer) => {
//   setInterval(() => {
//     const request = fetch(`http://localhost:7070/messages/unread`, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });

//     observer.next(request);
//   }, 1000)
// })

const obs$ = ajax.getJSON('https://polling-backend-panw.onrender.com/messages/unread')
  .pipe(
    // interval(1000),
    // map((userResponse) => {
    //   console.log(userResponse);
    //   return userResponse;
    // }),
    catchError((error) => {
      console.log('error: ', error);
      return of(error);
    }),
  );

obs$.subscribe({
  next: (value) => {
    const idList = Array.from(document.querySelectorAll('.list-message')).map((item) => item.getAttribute('id'));
    value.messages.forEach((item) => {
      if (!idList.includes(item.id)) {
        message.renderMessage(item);
      }
    });
  },
  error: (err) => console.log(err),
});

// stream$.subscribe(async (value) => {
//   const idList = Array.from(document.querySelectorAll('.list-message'))
//     .map(item => item.getAttribute('id'));

//   const result = await value
//   const json = await result.json()

// json.messages.forEach(item => {
//   if (!idList.includes(item.id)) {
//     message.renderMessage(item)
//   }
//   })
// });
