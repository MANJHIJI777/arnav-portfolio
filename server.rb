# ==============================================================================
# LOCAL DEVELOPMENT SERVER FOR ARNAV KUMAR PORTFOLIO
# Explicitly bound to 0.0.0.0 (localhost & 127.0.0.1) on Port 3000
# Fully RFC 7233 compliant HTTP Range Requests (206 Partial Content)
# Zero-syscall-error streaming (avoids sendfile EPERM under macOS sandbox)
# ==============================================================================

require 'webrick'

port = (ENV['PORT'] || 3000).to_i
root = File.expand_path(File.dirname(__FILE__))

# Patch WEBrick::HTTPResponse#send_body_io to:
# 1. Avoid Kernel sendfile(2) which fails with Errno::EPERM under macOS sandboxes
# 2. Reliably stream byte ranges and full files in 64KB chunks
class WEBrick::HTTPResponse
  def send_body_io(socket)
    begin
      if chunked?
        while (buf = @body.readpartial(@buffer_size))
          socket.write("#{buf.bytesize.to_s(16)}#{WEBrick::CRLF}#{buf}#{WEBrick::CRLF}")
        end
        socket.write("0#{WEBrick::CRLF}#{WEBrick::CRLF}")
      else
        if %r{\Abytes (\d+)-(\d+)/\d+\z} =~ @header['content-range']
          offset = $1.to_i
          size = $2.to_i - offset + 1
        else
          offset = nil
          size = @header['content-length']
          size = size.to_i if size
        end

        @body.seek(offset, IO::SEEK_SET) if offset
        remaining = size || Float::INFINITY
        @sent_size = 0
        while remaining > 0
          chunk_len = [65536, remaining].min
          buf = @body.read(chunk_len)
          break unless buf && !buf.empty?
          socket.write(buf)
          @sent_size += buf.bytesize
          remaining -= buf.bytesize
        end
      end
    rescue EOFError
      # Completed stream
    ensure
      @body.close if @body && !@body.closed?
    end
    remove_body_tempfile
  end
end

# Patch WEBrick DefaultFileHandler to:
# 1. Add Accept-Ranges: bytes to all file responses
# 2. Add Cache-Control for immutable static assets
# 3. Ensure make_partial_content preserves open file handles
module WEBrick
  module HTTPServlet
    class DefaultFileHandler
      alias_method :orig_do_GET, :do_GET

      def do_GET(req, res)
        orig_do_GET(req, res)
        res['accept-ranges'] = 'bytes'
        if req.path.start_with?('/assets/')
          res['cache-control'] = 'public, max-age=31536000, immutable'
        end
      end

      def make_partial_content(req, res, filename, filesize)
        mtype = HTTPUtils::mime_type(filename, @config[:MimeTypes])
        ranges = HTTPUtils::parse_range_header(req['range'])
        unless ranges && !ranges.empty?
          raise HTTPStatus::BadRequest, "Unrecognized range-spec: #{req['range']}"
        end

        range = ranges[0]
        first, last = prepare_range(range, filesize)
        if first < 0
          res['content-range'] = "bytes */#{filesize}"
          raise HTTPStatus::RequestRangeNotSatisfiable
        end

        length = last - first + 1
        res.status = 206
        res['content-type'] = mtype
        res['accept-ranges'] = 'bytes'
        res['content-range'] = "bytes #{first}-#{last}/#{filesize}"
        res['content-length'] = length.to_s
        if req.path.start_with?('/assets/')
          res['cache-control'] = 'public, max-age=31536000, immutable'
        end

        file = File.open(filename, 'rb')
        res.body = file
      end
    end
  end
end

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
puts "  HTTP Range Requests (206):           SUPPORTED (RFC 7233)"
puts "=================================================================="
puts "\n"
$stdout.flush

server.start
