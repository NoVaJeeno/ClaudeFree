class PhoenixProtocol:
    def __init__(self):
        pass

    def verify_token(self, token: str) -> bool:
        return token == "MASTER_SECRET_PHOENIX"
