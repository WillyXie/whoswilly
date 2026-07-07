import { Component } from '@angular/core';
import { Base } from '@app/base/base';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-note-little-book-of-semaphore',
  imports: [RouterLink],
  templateUrl: './note-little-book-of-semaphore.html',
  styleUrl: './note-little-book-of-semaphore.css',
})
export class NoteLittleBookOfSemaphore extends Base {
  codeMutex: string = `
// Thread A & B
mutex.wait()
// critical section
mutex.post()
`.trim();

  codeRendezvous: string = `
// Thread A
aArrived.post()
bArrived.wait()
// critical section

// Thread B
bArrived.post()
aArrived.wait()
// critical section
`.trim();

  // Chapter 1 – Non-Determinism examples
  codePrint: string = `
// Thread A            // Thread B
print("yes")           print("no")

// Possible outputs:
//   "yesno"
//   "noyes"
//   "ynoes" <= characters interleaved mid-write
`.trim();

  codeWrite: string = `
int x = 0;

// Thread A            // Thread B
x = 5;                 x = 7;
print(x)

// Final value of x is NON-DETERMINISTIC:
//   Terminal shows 5 if Thread A updates last or print first before B updates
//   Terminal shows 7 if Thread B updates last
`.trim();

  codeUpdate: string = `
int count = 0;

// Thread A             // Thread B
temp_a = count;         temp_b = count;
temp_a++;               temp_b++;
count = temp_a;         count = temp_b;

// Expected: count == 2
// Actual:   count == 1
`.trim();
}
