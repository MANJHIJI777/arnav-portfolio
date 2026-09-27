# ==============================================================================
# LOCAL DEVELOPMENT SERVER FOR ARNAV KUMAR PORTFOLIO
# Explicitly bound to 0.0.0.0 (localhost & 127.0.0.1) on Port 3000
# Optimized for Safari video streaming with proper MIME types & range headers
# ==============================================================================

require 'webrick'

port = (ENV['PORT'] || 3000).to_i
root = File.expand_path(File.dirname(__FILE__))

# Ensure complete MIME types for modern web & Safari video streaming
mime_types = WEBrick::HTTPUtils::DefaultMimeTypes
mime_types['mp4']   = 'video/mp4'
mime_types['webm']  = 'video/webm'
mime_types['mov']   = 'video/quicktime'
mime_types['js']    = 'application/javascript'
mime_types['mjs']   = 'application/javascript'
mime_types['css']   = 'text/css'
mime_types['svg']   = 'image/svg+xml'
mime_types['json']  = 'application/json'
mime_types['woff2'] = 'font/woff2'
mime_types['woff']  = 'font/woff'

server = WEBrick::HTTPServer.new(
  Port: port,
  BindAddress: '0.0.0.0',
  DocumentRoot: root,
  MimeTypes: mime_types,
  Logger: WEBrick::Log.new($stdout, WEBrick::BasicLog::INFO),
  AccessLog: [
    [$stdout, WEBrick::AccessLog::COMMON_LOG_FORMAT]
  ]
)

trap('INT')  { server.shutdown }
trap('TERM') { server.shutdown }

puts "\n"
puts "=================================================================="
puts "  ARNAV KUMAR // VIDEO EDITOR PORTFOLIO"
puts "  Local development server running at: http://localhost:#{port}"
puts "  Also accessible at:                  http://127.0.0.1:#{port}"
puts "=================================================================="
puts "\n"
$stdout.flush

server.start
