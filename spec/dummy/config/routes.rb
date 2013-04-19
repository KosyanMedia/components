Dummy::Application.routes.draw do
  root :to => 'home#index'

  if Rails.env.test? || Rails.env.development?
    mount Jasminerice::Engine => "/jasmine"
    get "/jasmine/:suite" => "jasminerice/spec#index"
  end
end
