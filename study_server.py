import http.server
import socketserver
import json
import subprocess
import os

PORT = 8000

class StudyPortalHandler(http.server.SimpleHTTPRequestHandler):
    def do_OPTIONS(self):
        # Handle CORS preflight request
        self.send_response(200, "ok")
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type")
        self.end_headers()

    def do_POST(self):
        if self.path == '/api/verify':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            try:
                request_payload = json.loads(post_data.decode('utf-8'))
                tool = request_payload.get('tool')
                
                status, output = self.verify_environment(tool)
                
                response_data = {
                    "tool": tool,
                    "status": status,
                    "output": output
                }
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps(response_data).encode('utf-8'))
                
            except Exception as e:
                self.send_response(400)
                self.end_headers()
                self.wfile.write(str(e).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()

    def verify_environment(self, tool):
        # Execute local diagnostics using subprocess
        try:
            if tool == 'git':
                # Check git presence
                res = subprocess.run(['git', '--version'], capture_output=True, text=True, shell=True)
                if res.returncode == 0:
                    return "success", f"Git active: {res.stdout.strip()}"
                return "failed", f"Git check failed: {res.stderr.strip()}"

            elif tool == 'docker':
                # Check docker CLI version and connection status
                res = subprocess.run(['docker', '--version'], capture_output=True, text=True, shell=True)
                if res.returncode == 0:
                    daemon_check = subprocess.run(['docker', 'info'], capture_output=True, text=True, shell=True)
                    if daemon_check.returncode == 0:
                        return "success", f"Docker Active!\nCLI: {res.stdout.strip()}\nDaemon: Reachable and running."
                    return "failed", f"Docker CLI found ({res.stdout.strip()}) but Daemon is stopped or unreachable."
                return "failed", "Docker command not found in local system PATH."

            elif tool == 'aws':
                # Check AWS CLI version and basic configure identity
                res = subprocess.run(['aws', '--version'], capture_output=True, text=True, shell=True)
                if res.returncode == 0:
                    caller = subprocess.run(['aws', 'sts', 'get-caller-identity'], capture_output=True, text=True, shell=True)
                    if caller.returncode == 0:
                        identity = json.loads(caller.stdout)
                        return "success", f"AWS CLI Active: {res.stdout.strip()}\nAuthenticated Account: {identity.get('Account')}\nARN: {identity.get('Arn')}"
                    return "failed", f"AWS CLI found ({res.stdout.strip()}) but CLI credentials are unauthenticated. Run 'aws configure' to fix."
                return "failed", "AWS CLI utility is not installed or not in System PATH."

            elif tool == 'python':
                # Check Python version
                res = subprocess.run(['python', '--version'], capture_output=True, text=True, shell=True)
                if res.returncode == 0:
                    return "success", f"Python Active: {res.stdout.strip()}"
                return "failed", "Python command not found in local system PATH."

            else:
                return "failed", f"Unknown verification tool target: {tool}"
                
        except Exception as e:
            return "failed", f"Diagnostics error occurred: {str(e)}"

# Setup serving mapping
handler = StudyPortalHandler
# Enable port reuse to avoid 'address already in use' errors on restarts
socketserver.TCPServer.allow_reuse_address = True

print(f"Starting server on http://localhost:{PORT}...")
with socketserver.TCPServer(("", PORT), handler) as httpd:
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping server.")
        httpd.server_close()
