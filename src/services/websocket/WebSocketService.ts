import { showToast } from 'vant';
import { ChatControllerService } from '../services/ChatControllerService';
import type { WebSocketConfigVO } from '../models/WebSocketConfigVO';

export interface WebSocketMessage {
  type: string | number;
  id?: number;
  senderId?: number;
  receiverId?: number;
  content?: string;
  createTime?: string;
  userId?: number;
  token?: string;
  timestamp?: number;
  message?: string; // 用于错误消息
  code?: number;    // 用于状态码
  sendTime?: string; // 发送时间
  [key: string]: any; // 允许其他扩展字段
}

export class WebSocketService {
  private static instance: WebSocketService | null = null;
  private messageHandlers: Array<(message: WebSocketMessage) => void> = [];
  private socket: WebSocket | null = null;
  private heartbeatTimer: number | null = null;
  private reconnectTimer: number | null = null;
  private userId: number | null = null;
  private connectionAttempts = 0;
  private maxReconnectAttempts = 10;
  private reconnectDelay = 3000; // 重连延时，单位毫秒
  private heartbeatInterval = 15000; // 心跳间隔，单位毫秒
  private heartbeatTimeout = 30000; // 心跳超时时间，单位毫秒
  private wsUrl: string | null = null;

  private constructor() {
    // 私有构造函数，防止直接实例化
  }

  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  /**
   * 初始化WebSocket服务
   * @param userId 当前用户ID
   * @returns 返回连接是否成功的Promise
   */
  public async initialize(userId: number): Promise<boolean> {
    if (!userId) {
      console.error('WebSocketService初始化失败：用户ID为空');
      return false;
    }

    this.userId = userId;
    
    try {
      // 获取WebSocket配置
      const response = await ChatControllerService.getWebSocketConfigUsingGet();
      
      if (response && response.code === 0 && response.data) {
        const config = response.data;
        this.wsUrl = config.wsUrl || null;
        
        // 更新心跳配置
        if (config.heartbeatTimeout) {
          this.heartbeatTimeout = config.heartbeatTimeout * 1000;
          this.heartbeatInterval = this.heartbeatTimeout / 2;
        }
        
        // 建立WebSocket连接
        return this.connect();
      } else {
        console.error('获取WebSocket配置失败', response);
        return false;
      }
    } catch (error) {
      console.error('WebSocketService初始化错误', error);
      return false;
    }
  }

  /**
   * 建立WebSocket连接
   * @returns 是否连接成功
   */
  private connect(): Promise<boolean> {
    return new Promise((resolve) => {
      if (!this.wsUrl) {
        console.error('WebSocket URL未设置');
        resolve(false);
        return;
      }

      // 清理现有连接
      this.cleanUp();
      
      try {
        this.socket = new WebSocket(this.wsUrl);
        
        this.socket.onopen = () => {
          console.log('WebSocket连接已建立');
          this.connectionAttempts = 0;
          
          // 发送认证消息
          this.sendAuthMessage();
          
          // 启动心跳
          this.startHeartbeat();
          
          resolve(true);
        };
        
        this.socket.onmessage = (event) => {
          this.handleMessage(event.data);
        };
        
        this.socket.onclose = () => {
          console.log('WebSocket连接已关闭');
          this.tryReconnect();
          resolve(false);
        };
        
        this.socket.onerror = (error) => {
          console.error('WebSocket连接错误', error);
          this.tryReconnect();
          resolve(false);
        };
      } catch (error) {
        console.error('建立WebSocket连接失败', error);
        this.tryReconnect();
        resolve(false);
      }
    });
  }

  /**
   * 发送认证消息
   */
  private sendAuthMessage(): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN || !this.userId) {
      return;
    }
    
    const authMessage: WebSocketMessage = {
      type: 0, // 认证消息类型
      userId: this.userId,
      senderId: this.userId,
      content: 'auth',
      timestamp: Date.now(),
      sendTime: new Date().toISOString()
    };
    
    try {
      this.socket.send(JSON.stringify(authMessage));
      console.log('已发送WebSocket认证消息');
    } catch (error) {
      console.error('发送认证消息失败', error);
    }
  }

  /**
   * 重新连接WebSocket
   * @returns 返回重连是否成功的Promise
   */
  public async reconnect(): Promise<boolean> {
    if (this.reconnectTimer) {
      window.clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    
    return this.connect();
  }

  /**
   * 尝试重新连接
   */
  private tryReconnect(): void {
    if (this.connectionAttempts >= this.maxReconnectAttempts) {
      console.log('已达到最大重连次数，停止重连');
      return;
    }
    
    // 停止心跳
    this.stopHeartbeat();
    
    // 清除旧的重连定时器
    if (this.reconnectTimer) {
      window.clearTimeout(this.reconnectTimer);
    }
    
    this.connectionAttempts++;
    
    // 设置指数退避算法的重连延迟
    const delay = Math.min(
      this.reconnectDelay * Math.pow(1.5, this.connectionAttempts - 1),
      30000 // 最大延迟30秒
    );
    
    console.log(`将在${delay}毫秒后尝试重连(第${this.connectionAttempts}次)`);
    
    this.reconnectTimer = window.setTimeout(() => {
      this.connect();
    }, delay);
  }

  /**
   * 发送消息
   * @param message 要发送的消息
   * @returns 是否发送成功
   */
  public sendMessage(message: WebSocketMessage): boolean {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.error('WebSocket未连接，无法发送消息');
      return false;
    }
    
    try {
      // 确保消息有时间戳和发送时间
      if (!message.timestamp) {
        message.timestamp = Date.now();
      }
      
      if (!message.sendTime) {
        message.sendTime = new Date().toISOString();
      }
      
      // 确保发送者ID已设置
      if (!message.senderId && this.userId) {
        message.senderId = this.userId;
      }
      
      this.socket.send(JSON.stringify(message));
      return true;
    } catch (error) {
      console.error('发送消息失败', error);
      return false;
    }
  }

  /**
   * 处理接收到的WebSocket消息
   * @param data 接收到的数据
   */
  private handleMessage(data: string): void {
    // 处理心跳响应
    if (data === 'PONG') {
      // console.log('收到心跳响应');
      return;
    }
    
    try {
      const message = typeof data === 'string' ? JSON.parse(data) : data;
      
      // 通知所有注册的消息处理器
      for (const handler of this.messageHandlers) {
        try {
          handler(message);
        } catch (handlerError) {
          console.error('消息处理器执行出错', handlerError);
        }
      }
    } catch (error) {
      console.error('解析WebSocket消息失败', error);
    }
  }

  /**
   * 注册消息处理器
   * @param handler 消息处理函数
   */
  public addMessageHandler(handler: (message: WebSocketMessage) => void): void {
    this.messageHandlers.push(handler);
  }

  /**
   * 移除消息处理器
   * @param handler 要移除的消息处理函数
   */
  public removeMessageHandler(handler: (message: WebSocketMessage) => void): void {
    const index = this.messageHandlers.indexOf(handler);
    if (index !== -1) {
      this.messageHandlers.splice(index, 1);
    }
  }

  /**
   * 启动心跳机制
   */
  private startHeartbeat(): void {
    // 停止现有心跳
    this.stopHeartbeat();
    
    this.heartbeatTimer = window.setInterval(() => {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        try {
          this.socket.send('PING');
          // console.log('发送心跳');
        } catch (error) {
          console.error('发送心跳失败', error);
          this.tryReconnect();
        }
      } else {
        // 连接已断开，尝试重连
        this.tryReconnect();
      }
    }, this.heartbeatInterval);
  }

  /**
   * 停止心跳机制
   */
  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      window.clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  /**
   * 清理所有资源
   */
  private cleanUp(): void {
    // 停止心跳
    this.stopHeartbeat();
    
    // 停止重连
    if (this.reconnectTimer) {
      window.clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    
    // 关闭socket
    if (this.socket) {
      try {
        this.socket.onopen = null;
        this.socket.onmessage = null;
        this.socket.onclose = null;
        this.socket.onerror = null;
        this.socket.close();
      } catch (error) {
        console.error('关闭WebSocket连接出错', error);
      }
      this.socket = null;
    }
  }

  /**
   * 检查WebSocket是否已连接
   * @returns 是否已连接
   */
  public isConnected(): boolean {
    return this.socket !== null && this.socket.readyState === WebSocket.OPEN;
  }

  /**
   * 关闭WebSocket连接
   * @param clearHandlers 是否清除所有消息处理器
   */
  public close(clearHandlers: boolean = true): void {
    this.cleanUp();
    
    if (clearHandlers) {
      this.messageHandlers = [];
    }
    
    this.connectionAttempts = 0;
  }
} 