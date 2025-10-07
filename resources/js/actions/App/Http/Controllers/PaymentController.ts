import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PaymentController::index
 * @see app/Http/Controllers/PaymentController.php:14
 * @route '/payments'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/payments',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PaymentController::index
 * @see app/Http/Controllers/PaymentController.php:14
 * @route '/payments'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PaymentController::index
 * @see app/Http/Controllers/PaymentController.php:14
 * @route '/payments'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PaymentController::index
 * @see app/Http/Controllers/PaymentController.php:14
 * @route '/payments'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PaymentController::create
 * @see app/Http/Controllers/PaymentController.php:26
 * @route '/payments/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/payments/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PaymentController::create
 * @see app/Http/Controllers/PaymentController.php:26
 * @route '/payments/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PaymentController::create
 * @see app/Http/Controllers/PaymentController.php:26
 * @route '/payments/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PaymentController::create
 * @see app/Http/Controllers/PaymentController.php:26
 * @route '/payments/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PaymentController::store
 * @see app/Http/Controllers/PaymentController.php:34
 * @route '/payments'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/payments',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PaymentController::store
 * @see app/Http/Controllers/PaymentController.php:34
 * @route '/payments'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PaymentController::store
 * @see app/Http/Controllers/PaymentController.php:34
 * @route '/payments'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PaymentController::show
 * @see app/Http/Controllers/PaymentController.php:39
 * @route '/payments/{payment}'
 */
export const show = (args: { payment: string | number } | [payment: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/payments/{payment}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PaymentController::show
 * @see app/Http/Controllers/PaymentController.php:39
 * @route '/payments/{payment}'
 */
show.url = (args: { payment: string | number } | [payment: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { payment: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    payment: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        payment: args.payment,
                }

    return show.definition.url
            .replace('{payment}', parsedArgs.payment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PaymentController::show
 * @see app/Http/Controllers/PaymentController.php:39
 * @route '/payments/{payment}'
 */
show.get = (args: { payment: string | number } | [payment: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PaymentController::show
 * @see app/Http/Controllers/PaymentController.php:39
 * @route '/payments/{payment}'
 */
show.head = (args: { payment: string | number } | [payment: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PaymentController::edit
 * @see app/Http/Controllers/PaymentController.php:0
 * @route '/payments/{payment}/edit'
 */
export const edit = (args: { payment: string | number } | [payment: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/payments/{payment}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PaymentController::edit
 * @see app/Http/Controllers/PaymentController.php:0
 * @route '/payments/{payment}/edit'
 */
edit.url = (args: { payment: string | number } | [payment: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { payment: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    payment: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        payment: args.payment,
                }

    return edit.definition.url
            .replace('{payment}', parsedArgs.payment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PaymentController::edit
 * @see app/Http/Controllers/PaymentController.php:0
 * @route '/payments/{payment}/edit'
 */
edit.get = (args: { payment: string | number } | [payment: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PaymentController::edit
 * @see app/Http/Controllers/PaymentController.php:0
 * @route '/payments/{payment}/edit'
 */
edit.head = (args: { payment: string | number } | [payment: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PaymentController::update
 * @see app/Http/Controllers/PaymentController.php:0
 * @route '/payments/{payment}'
 */
export const update = (args: { payment: string | number } | [payment: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/payments/{payment}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\PaymentController::update
 * @see app/Http/Controllers/PaymentController.php:0
 * @route '/payments/{payment}'
 */
update.url = (args: { payment: string | number } | [payment: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { payment: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    payment: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        payment: args.payment,
                }

    return update.definition.url
            .replace('{payment}', parsedArgs.payment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PaymentController::update
 * @see app/Http/Controllers/PaymentController.php:0
 * @route '/payments/{payment}'
 */
update.put = (args: { payment: string | number } | [payment: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\PaymentController::update
 * @see app/Http/Controllers/PaymentController.php:0
 * @route '/payments/{payment}'
 */
update.patch = (args: { payment: string | number } | [payment: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\PaymentController::destroy
 * @see app/Http/Controllers/PaymentController.php:48
 * @route '/payments/{payment}'
 */
export const destroy = (args: { payment: string | number } | [payment: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/payments/{payment}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\PaymentController::destroy
 * @see app/Http/Controllers/PaymentController.php:48
 * @route '/payments/{payment}'
 */
destroy.url = (args: { payment: string | number } | [payment: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { payment: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    payment: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        payment: args.payment,
                }

    return destroy.definition.url
            .replace('{payment}', parsedArgs.payment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PaymentController::destroy
 * @see app/Http/Controllers/PaymentController.php:48
 * @route '/payments/{payment}'
 */
destroy.delete = (args: { payment: string | number } | [payment: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})
const PaymentController = { index, create, store, show, edit, update, destroy }

export default PaymentController