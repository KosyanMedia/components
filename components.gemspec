Gem::Specification.new do |spec|
  spec.name          = 'components'
  spec.version       = '0.0.1'
  spec.authors       = ['Anton Pleshivtsev']
  spec.email         = ['anton@emby.ru']
  spec.description   = 'Aviasales/Jetradar team ui widgets used in our public projects.'
  spec.summary       = 'AngularJS components'
  spec.homepage      = 'https://github.com/KosyanMedia/components'
  spec.license       = 'MIT'

  spec.files         = `git ls-files`.split($/)
  spec.executables   = spec.files.grep(%r{^bin/}) { |f| File.basename(f) }
  spec.test_files    = spec.files.grep(%r{^(test|spec|features)/})
  spec.require_paths = ['lib']

  spec.add_development_dependency 'bundler', '~> 1.3'
  spec.add_development_dependency 'rails', '>= 3.2'
  spec.add_development_dependency 'rake'
  spec.add_development_dependency 'angularjs-rails'
  spec.add_development_dependency 'jquery-rails'
  spec.add_development_dependency 'jasminerice'
  spec.add_development_dependency 'sass-rails'
  spec.add_development_dependency "bourbon"
end
