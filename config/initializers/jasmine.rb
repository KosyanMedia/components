=begin
if Rails.env.test? || Rails.env.development?
  Rails.application.config.assets.paths << NanoUi::Engine.root.join('spec', 'javascripts', 'nano_ui') << NanoUi::Engine.root.join('spec', 'stylesheets')
  ActionController::Base.prepend_view_path NanoUi::Engine.root
end
=end
