import {
  catchError, of, interval, mergeMap,
} from 'rxjs';
import { ajax } from 'rxjs/ajax';
import CreateNewMessage from './CreateNewMessage';

import background from '../img/cell.jpg';

document.querySelector('body').style.backgroundImage = `url(${background})`;

const mailBox = document.querySelector('.container-mail');

const message = new CreateNewMessage(mailBox);

const ajaxInterval$ = interval(1000);

ajaxInterval$
  .pipe(
    mergeMap(() => ajax.getJSON('http://localhost:7070/messages/unread')
      .pipe(
        catchError((error) => {
          console.log('error: ', error);
          return of(null);
        }),
      )),
  )
  .subscribe({
    next: (value) => {
      console.log(value);
      const idList = Array.from(document.querySelectorAll('.list-message')).map((item) => item.getAttribute('id'));
      if (value) {
        value.messages.forEach((item) => {
          if (!idList.includes(item.id)) {
            message.renderMessage(item);
          }
        });
      }
    },
    error: (err) => console.log(err),
  });
