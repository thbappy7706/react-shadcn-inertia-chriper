import PaymentController from './PaymentController'
import CategoryController from './CategoryController'
import PostController from './PostController'
import ProductController from './ProductController'
import CustomerController from './CustomerController'
import Settings from './Settings'
import Auth from './Auth'
const Controllers = {
    PaymentController: Object.assign(PaymentController, PaymentController),
CategoryController: Object.assign(CategoryController, CategoryController),
PostController: Object.assign(PostController, PostController),
ProductController: Object.assign(ProductController, ProductController),
CustomerController: Object.assign(CustomerController, CustomerController),
Settings: Object.assign(Settings, Settings),
Auth: Object.assign(Auth, Auth),
}

export default Controllers