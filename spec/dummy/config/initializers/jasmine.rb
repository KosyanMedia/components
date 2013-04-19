if Rails.env.test? || Rails.env.development?
  Rails.application.config.assets.paths << Rails.root.join('..', 'javascripts')
  Rails.application.config.assets.paths << Rails.root.join('..', '..', 'lib', 'assets', 'javascripts')
  # << NanoUi::Engine.root.join('spec', 'stylesheets')
  #ActionController::Base.prepend_view_path NanoUi::Engine.root
end

