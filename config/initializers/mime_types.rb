# /config/initializers/mime_types.rb
Mime::Type.register "application/wasm", :wasm

# config/initializers/wasm_mime_type.rb
class WasmMimeTypeMiddleware
  def initialize(app)
    @app = app
  end

  def call(env)
    status, headers, response = @app.call(env)

    if env["PATH_INFO"].end_with?(".wasm")
      headers["Content-Type"] = "application/wasm"
    end

    [status, headers, response]
  end
end
Rails.application.config.middleware.use WasmMimeTypeMiddleware