# SvelteKit Template

This project contains a working, mostly fleshed-out template for a SvelteKit app. It performs <accronym title="Create, Read, Update, Delete">CRUD</acronym> on _entities_, or domain objects, the nouns in your app. The example models a workout, like at the gym. A Workout contains an ordered collection of Sets. A Set is made up up an ordered collection of Activities. Activities can be Exercises or Rest and have a duration, mesured in a number of seconds.

## Entities

The entities are modeled as TypeScript types in `$lib/entities.d.ts`. In addition to its strongly typed definition, each entity has a `Pending` version. _Pending_ entities are loosely typed, allowing them to be bound to inputs, for example, in a HTML form that only supports `string` inputs (well, [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData)).


## CRUD

Each entity has the following default routes:

* `/entities`: Lists all instances, allows clicking into
    * `/[label]`: An individual entity instance, by default, read-only
        * `/edit`: A form view that allows for updating an individual instance
    * `/new/`: A form view to create a new instance. A `POST` redirects to `/eneties/[label]` or `/eneties/[label]/edit`.

### Data Access

All data access goes through an API library, `$lib/server/api.js`. The API is responsible for encapsulating the database and enforcing business rules. The `$lib/server` path ensures that it‘s not executed on the client. 

#### Validation

Enforcing business rules, such as validating user inputs or handling database constraint violations, are communicated as part of an API’s return types. And `InvalidResult` type return allows a function to return the user input and a collection of one or more validation errors. APIs should only throw (or bubble) exceptions for unexpected states that the user cannot fix themselves by submitting different data. An empty value for a required property is a validation error, not an exceptional case. The user should resubmit with a different value. A dropped database connection, on the other hand, is an error state that the user can’t do anything about. 

<figure>
    <figcaption>Example API function, `$lib/server/api.js`</figcaption>
<pre>
/**
<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="currentColor"  class="icon icon-tabler icons-tabler-filled icon-tabler-circle-number-1"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10 -10 10s-10 -4.477 -10 -10s4.477 -10 10 -10zm.994 5.886c-.083 -.777 -1.008 -1.16 -1.617 -.67l-.084 .077l-2 2l-.083 .094a1 1 0 0 0 0 1.226l.083 .094l.094 .083a1 1 0 0 0 1.226 0l.094 -.083l.293 -.293v5.586l.007 .117a1 1 0 0 0 1.986 0l.007 -.117v-8l-.006 -.114z" /></svg>
 * @param {Pending<kbd>Entity</kbd>} input
<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="currentColor"  class="icon icon-tabler icons-tabler-filled icon-tabler-circle-number-2"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10 -10 10s-10 -4.477 -10 -10s4.477 -10 10 -10zm1 5h-3l-.117 .007a1 1 0 0 0 0 1.986l.117 .007h3v2h-2l-.15 .005a2 2 0 0 0 -1.844 1.838l-.006 .157v2l.005 .15a2 2 0 0 0 1.838 1.844l.157 .006h3l.117 -.007a1 1 0 0 0 0 -1.986l-.117 -.007h-3v-2h2l.15 -.005a2 2 0 0 0 1.844 -1.838l.006 -.157v-2l-.005 -.15a2 2 0 0 0 -1.838 -1.844l-.157 -.006z" /></svg>
 * @returns {Promise&lt;Result&lt;Pending<kbd>Entity</kbd>, <kbd>Entity</kbd>, '<kbd>entity</kbd>'>>}
 */
export async function create_<kbd>entity</kbd>(input) {
  /** @type {Validation&lt;<kbd>Entity</kbd>>[]} */
  const validations = [];
<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="currentColor"  class="icon icon-tabler icons-tabler-filled icon-tabler-circle-number-3"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10 -10 10s-10 -4.477 -10 -10s4.477 -10 10 -10zm1 5h-2l-.15 .005a2 2 0 0 0 -1.85 1.995a1 1 0 0 0 1.974 .23l.02 -.113l.006 -.117h2v2h-2l-.133 .007c-1.111 .12 -1.154 1.73 -.128 1.965l.128 .021l.133 .007h2v2h-2l-.007 -.117a1 1 0 0 0 -1.993 .117a2 2 0 0 0 1.85 1.995l.15 .005h2l.15 -.005a2 2 0 0 0 1.844 -1.838l.006 -.157v-2l-.005 -.15a1.988 1.988 0 0 0 -.17 -.667l-.075 -.152l-.019 -.032l.02 -.03a2.01 2.01 0 0 0 .242 -.795l.007 -.174v-2l-.005 -.15a2 2 0 0 0 -1.838 -1.844l-.157 -.006z" /></svg>
  if (!test(input.<kbd>property</kbd>)) 
        validations.push({ message: 'Name is required', for: '<kbd>property</kbd>' });
  
<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="currentColor"  class="icon icon-tabler icons-tabler-filled icon-tabler-circle-number-4"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10 -10 10s-10 -4.477 -10 -10s4.477 -10 10 -10zm2 5a1 1 0 0 0 -.993 .883l-.007 .117v3h-2v-3l-.007 -.117a1 1 0 0 0 -1.986 0l-.007 .117v3l.005 .15a2 2 0 0 0 1.838 1.844l.157 .006h2v3l.007 .117a1 1 0 0 0 1.986 0l.007 -.117v-8l-.007 -.117a1 1 0 0 0 -.993 -.883z" /></svg>
    // If the response is invalid, return an `InvalidResult`, 
    // which includes the input and the validations
  if (has(validations)) {
    return { <kbd>entity</kbd>: input, validations };
  }

<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="currentColor"  class="icon icon-tabler icons-tabler-filled icon-tabler-circle-number-5"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10 -10 10s-10 -4.477 -10 -10s4.477 -10 10 -10zm2 5h-4a1 1 0 0 0 -.993 .883l-.007 .117v4a1 1 0 0 0 .883 .993l.117 .007h3v2h-2l-.007 -.117a1 1 0 0 0 -1.993 .117a2 2 0 0 0 1.85 1.995l.15 .005h2a2 2 0 0 0 1.995 -1.85l.005 -.15v-2a2 2 0 0 0 -1.85 -1.995l-.15 -.005h-2v-2h3a1 1 0 0 0 .993 -.883l.007 -.117a1 1 0 0 0 -.883 -.993l-.117 -.007z" /></svg>
  const <kbd>entity</kbd> = await /** @type {<kbd>Entity</kbd>} */ (
        // db.query(`INSERT <kbd>entity</kbd> RETURNING …`);
    );
  return <kbd>entity</kbd>;
}
</pre>
</figure>

1. Inputs typcially use the `Pending` version of the entity type. This allows (mostly) straightforward mapping from `FormData`.
1. APIs that perform validation use the `Result<In, Out, Prop>` return type to convey validation results, if necessary. 
    * `In` is the type of `input`, for CRUD operations, usually the `Pending` version of an entity
    * `Out` is the expected return type, often the strongly typed form of the pending input. [Postel’s Law](https://en.wikipedia.org/wiki/Robustness_principle): “Be conservative in what you send, be liberal in what you accept from others.”
    * `Prop` is the `string` name of the property in which the `input` will be stashed in the `InvalidResult` instance.
1. Page handlers, `+page.server.js`, should be “dumb”. They should be responsible for collecting data from the UI and passing to the appropriate API. APIs implement the valaidation logic.
1. Validation errors return `InvalidResult` instances. Page handlers can use the `is_valid()` guard function to differentiate between a `Result` and `InvalidResult` type.
1. In the happy path, where the input is valid, the return value does not need to be wrapped. This is equivalent to a <code><kbd>Entity</kbd></code> return type. Thus APIs that don’t do any validation do not need to do the `Result`/`InvalidResult` rigamarole.

Validation failures use SvelteKit’s `fail()` response to convey an HTTP `400` error that’s available to the page in the `form` property of `$props()`. Exceptions return a `500` `error()`. Generally errors should be allowed to bubble and handled at the closest parent [error boundary](https://joyofcode.xyz/catch-errors-during-rendering-with-svelte-error-boundaries).

<figure>
    <figcaption>Page handler, <code>+page.server.js</code>, form actions</figcaption>
    <pre>
/** @satisfies {import('./$types').Actions} */
export const actions = {
  create: async ({ request }) => {
    const workout_input = /** @type {PendingWorkout} */ (
      Object.fromEntries(await request.formData())
    );

    const workout = await api.create_workout(workout_input);

    // Careful with the params. The message sent back in the `form` or the `fail`
    // needs to be an object with an `exercise` property (well, `Prop` constant).
    if (is_invalid(workout)) return fail(400, workout);
    //return { workout };
    return redirect(303, `/workouts/${workout.label}`);
  }
};
    </pre>
</figure>

<style> 
    pre svg { 
        margin: 0.5em 0 .5em -0.5em;
        color: #0096c7;
    }
</style>