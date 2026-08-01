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
  codeSignaling: string = `
// Initialization
sem = Semaphore(0)

// Thread A                 // Thread B
statement A1                sem.wait()
sem.post()                  statement B2

// Deterministic Result:
// statement A1 is GUARANTEED to execute before statement B2.
`.trim();

  codeMutex: string = `
// Initialization
mutex = Semaphore(1)

// Thread A                 // Thread B
mutex.wait()                mutex.wait()
// critical section         // critical section
// (e.g., count += 1)       // (e.g., count += 1)
mutex.post()                mutex.post()

// Deterministic Result:
// Threads execute critical sections sequentially. No race condition occurs, 
// and count is updated correctly.
`.trim();

  codeRendezvous: string = `
// Initialization
aArrived = Semaphore(0)
bArrived = Semaphore(0)

// Thread A                 // Thread B
statement A1                statement B1
aArrived.post()             bArrived.post()
bArrived.wait()             aArrived.wait()
statement A2                statement B2

// Deterministic Result:
// statement A1 executes before statement B2, and
// statement B1 executes before statement A2.
`.trim();

  codeMultiplex: string = `
// Initialization
multiplex = Semaphore(N)

// Thread i
multiplex.wait()
// critical section (at most N threads active simultaneously)
multiplex.post()

// Deterministic Result:
// At any point in time, the number of threads executing inside 
// the critical section is at most N.
`.trim();

  codeBarrier: string = `
// Initialization
mutex = Semaphore(1)
barrier = Semaphore(0)
count = 0

// Thread i (out of n threads)
mutex.wait()
  count = count + 1
mutex.post()

if count == n:
  barrier.post()

barrier.wait()
barrier.post() // Turnstile: wakes up the next waiting thread

// Deterministic Result:
// All n threads complete their pre-barrier statements before any thread 
// is allowed to execute its post-barrier statements.
`.trim();

  codeQueue: string = `
// Initialization
leaderQueue = Semaphore(0)
followerQueue = Semaphore(0)

// Leader Thread            // Follower Thread
followerQueue.post()        leaderQueue.post()
leaderQueue.wait()          followerQueue.wait()
dance()                     dance()

// Deterministic Result:
// Leaders and followers are paired up in lockstep. A leader and a follower 
// will always execute dance() together.
`.trim();

  codeProducerConsumer: string = `
// Initialization
mutex = Semaphore(1)
items = Semaphore(0)
spaces = Semaphore(N) // N is buffer capacity

// Producer                 // Consumer
spaces.wait()               items.wait()
mutex.wait()                mutex.wait()
// add item to buffer        // remove item from buffer
mutex.post()                mutex.post()
items.post()                spaces.post()

// Deterministic Result:
// The buffer never overflows (producer blocks if spaces == 0) and never 
// underflows (consumer blocks if items == 0). Buffer updates are race-free.
`.trim();

  codeReadersWriters: string = `
// Initialization
mutex = Semaphore(1)
roomEmpty = Semaphore(1)
readCount = 0

// Reader                   // Writer
mutex.wait()                roomEmpty.wait()
  readCount++                 // write to shared resource
  if readCount == 1:        roomEmpty.post()
    roomEmpty.wait()
mutex.post()

// read shared resource

mutex.wait()
  readCount--
  if readCount == 0:
    roomEmpty.post()
mutex.post()

// Deterministic Result:
// Multiple readers can read simultaneously. Writers have exclusive access 
// (no readers or other writers can be active).
`.trim();

  codeDiningPhilosophers: string = `
// Initialization
forks = [Semaphore(1), Semaphore(1), Semaphore(1), Semaphore(1), Semaphore(1)]
multiplex = Semaphore(4) // At most 4 philosophers at a table of 5

// Philosopher i (0 to 4)
multiplex.wait()
  forks[left(i)].wait()
  forks[right(i)].wait()
  // eat()
  forks[right(i)].post()
  forks[left(i)].post()
multiplex.post()

// Deterministic Result:
// Deadlock is impossible because at least one philosopher is guaranteed 
// to get both forks and finish eating, releasing them.
`.trim();

  codeCigaretteSmokers: string = `
// Initialization
tobacco = Semaphore(0); paper = Semaphore(0); match = Semaphore(0)
isTobacco = false; isPaper = false; isMatch = false
mutex = Semaphore(1)

// Pushers (run by helper threads when agent puts items)
// Pusher A (runs when tobacco is put on table)
mutex.wait()
  if isPaper:
    isPaper = false; match.post() // wake match smoker
  else if isMatch:
    isMatch = false; paper.post() // wake paper smoker
  else:
    isTobacco = true
mutex.post()

// Smoker with Match (runs when signal on match is received)
match.wait()
  make_cigarette()
  agent.post() // request more ingredients
  smoke()

// Deterministic Result:
// Only the correct smoker is awakened for the available ingredients. 
// No deadlock or starvation occurs.
`.trim();  codeDiningSavages: string = `
// Initialization
mutex = Semaphore(1)
potEmpty = Semaphore(0)
potFull = Semaphore(0)
servings = 0

// Savage Thread                        // Cook Thread
while true:                             while true:
  mutex.wait()                            potEmpty.wait()
  if servings == 0:                       servings = M // refill
    potEmpty.post()                       potFull.post()
    potFull.wait()
  servings--
  // eat()
  mutex.post()

// Deterministic Result:
// Savages only eat when servings > 0. The cook is awakened exactly when 
// servings reach 0, refilling the pot before savages proceed.
`.trim();

  codeBarbershop: string = `
// Initialization
mutex = Semaphore(1)
customer = Semaphore(0)
barber = Semaphore(0)
customerChair = Semaphore(0)
barberChair = Semaphore(0)
customers = 0

// Customer Thread                      // Barber Thread
mutex.wait()                            while true:
if customers == n:                        customer.wait()
  mutex.post()                            barber.post()
  balk() // leave if chairs full          // cut_hair()
customers++                               barberChair.wait()
mutex.post()                              customerChair.post()

customer.post()
barber.wait()
// get_haircut()
customerChair.post()
barberChair.wait()

mutex.wait()
customers--
mutex.post()

// Deterministic Result:
// Customers leave if all n waiting chairs are full. Barber sleeps when 
// customers == 0, and wakes up to cut hair sequentially.
`.trim();

  codeSantaClaus: string = `
// Initialization
santaSem = Semaphore(0); reindeerSem = Semaphore(0); elfSem = Semaphore(0)
mutex = Semaphore(1)
elves = 0; reindeer = 0

// Santa Claus Thread
while true:
  santaSem.wait()
  mutex.wait()
  if reindeer == 9:
    reindeer = 0
    reindeerSem.post() // deliver toys (all 9 reindeer)
  else if elves == 3:
    elfSem.post() // help 3 elves
  mutex.post()
`.trim();

  codeSearchInsertDelete: string = `
// Initialization
insertMutex = Semaphore(1)
noSearchers = Semaphore(1)
noInserters = Semaphore(1)
searchSwitch = Lightswitch()
insertSwitch = Lightswitch()

// Searcher Thread                      // Inserter Thread
searchSwitch.lock(noSearchers)          insertMutex.wait()
// search()                             insertSwitch.lock(noInserters)
searchSwitch.unlock(noSearchers)        // insert()
                                        insertSwitch.unlock(noInserters)
// Deleter Thread                       insertMutex.post()
noSearchers.wait()
noInserters.wait()
// delete()
noInserters.post()
noSearchers.post()

// Deterministic Result:
// Searchers run concurrently with each other and Inserters. Inserters run 
// sequentially. Deleters have exclusive access (no searchers/inserters active).
`.trim();

  codeUnisexBathroom: string = `
// Initialization
empty = Semaphore(1)
maleSwitch = Lightswitch()
femaleSwitch = Lightswitch()
maleMultiplex = Semaphore(3) // max 3 men

// Male Thread
maleSwitch.lock(empty)
maleMultiplex.wait()
  // use_bathroom()
maleMultiplex.post()
maleSwitch.unlock(empty)

// Deterministic Result:
// The bathroom is never shared by men and women simultaneously, and at 
// most 3 people of the same gender are inside at any time.
`.trim();

  codeSushiBar: string = `
// Initialization
mutex = Semaphore(1)
block = Semaphore(0)
eating = 0; waiting = 0
mustWait = false

// Customer Thread
mutex.wait()
if mustWait:
  waiting++
  mutex.post()
  block.wait()
else:
  eating++
  mustWait = (eating == 5)
  mutex.post()

// eat_sushi()

mutex.wait()
eating--
if eating == 0:
  n = min(5, waiting)
  waiting -= n
  eating += n
  mustWait = (eating == 5)
  block.post() // release waiting batch
mutex.post()
`.trim();

  codePythonSync: string = `
import threading

# Create a lock (mutex) and a semaphore
mutex = threading.Lock()
sem = threading.Semaphore(3)

# Thread execution using context managers
with mutex:
    # critical section (automatic acquire and release)
    pass
`.trim();

  codeCSync: string = `
#include <pthread.h>
#include <semaphore.h>

pthread_mutex_t mutex = PTHREAD_MUTEX_INITIALIZER;
sem_t sem;

void* thread_func(void* arg) {
    pthread_mutex_lock(&mutex);
    // critical section
    pthread_mutex_unlock(&mutex);
    return NULL;
}
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
