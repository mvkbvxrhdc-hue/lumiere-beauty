-- 优惠券系统数据库表

-- 优惠券表
CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  
  -- 优惠类型：percentage（百分比折扣）、fixed（固定金额）、free_shipping（免运费）
  discount_type VARCHAR(20) NOT NULL DEFAULT 'percentage',
  discount_value DECIMAL(10, 2) NOT NULL,
  
  -- 使用条件
  min_purchase_amount DECIMAL(10, 2) DEFAULT 0,
  max_discount_amount DECIMAL(10, 2), -- 最高折扣金额（针对百分比折扣）
  
  -- 适用范围
  applicable_to VARCHAR(20) DEFAULT 'all', -- all, products, services, categories
  applicable_ids TEXT[], -- 适用的产品/服务/分类ID列表
  excluded_ids TEXT[], -- 排除的产品/服务/分类ID列表
  
  -- 使用限制
  usage_limit INTEGER, -- 总使用次数限制
  usage_limit_per_user INTEGER DEFAULT 1, -- 每用户使用次数限制
  used_count INTEGER DEFAULT 0, -- 已使用次数
  
  -- 用户限制
  is_new_user_only BOOLEAN DEFAULT FALSE, -- 仅新用户可用
  user_ids TEXT[], -- 指定用户ID列表（如果为空则所有用户可用）
  
  -- 有效期
  start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE,
  
  -- 优惠券类型标签
  coupon_type VARCHAR(50) DEFAULT 'general', -- general, welcome, holiday, birthday, vip, referral
  
  -- 状态
  is_active BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 用户优惠券使用记录表
CREATE TABLE IF NOT EXISTS coupon_usages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id UUID NOT NULL REFERENCES coupons(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  order_id UUID, -- 关联订单ID
  
  -- 使用详情
  discount_applied DECIMAL(10, 2) NOT NULL,
  original_total DECIMAL(10, 2) NOT NULL,
  final_total DECIMAL(10, 2) NOT NULL,
  
  used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 用户优惠券领取表（用户领取的优惠券）
CREATE TABLE IF NOT EXISTS user_coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  coupon_id UUID NOT NULL REFERENCES coupons(id) ON DELETE CASCADE,
  
  -- 状态：available（可用）、used（已使用）、expired（已过期）
  status VARCHAR(20) DEFAULT 'available',
  
  claimed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  used_at TIMESTAMP WITH TIME ZONE,
  
  UNIQUE(user_id, coupon_id)
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_is_active ON coupons(is_active);
CREATE INDEX IF NOT EXISTS idx_coupons_coupon_type ON coupons(coupon_type);
CREATE INDEX IF NOT EXISTS idx_coupons_dates ON coupons(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_coupon_usages_user ON coupon_usages(user_id);
CREATE INDEX IF NOT EXISTS idx_coupon_usages_coupon ON coupon_usages(coupon_id);
CREATE INDEX IF NOT EXISTS idx_user_coupons_user ON user_coupons(user_id);
CREATE INDEX IF NOT EXISTS idx_user_coupons_status ON user_coupons(status);

-- 启用行级安全
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_usages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_coupons ENABLE ROW LEVEL SECURITY;

-- RLS策略：优惠券（所有人可读活跃优惠券）
CREATE POLICY "Anyone can view active coupons" ON coupons
  FOR SELECT USING (is_active = true);

-- RLS策略：使用记录（用户只能查看自己的）
CREATE POLICY "Users can view own coupon usages" ON coupon_usages
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own coupon usages" ON coupon_usages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS策略：用户优惠券（用户只能查看和操作自己的）
CREATE POLICY "Users can view own coupons" ON user_coupons
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can claim coupons" ON user_coupons
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own coupons" ON user_coupons
  FOR UPDATE USING (auth.uid() = user_id);

-- 插入示例优惠券数据
INSERT INTO coupons (code, name, description, discount_type, discount_value, min_purchase_amount, max_discount_amount, is_new_user_only, coupon_type, start_date, end_date, usage_limit) VALUES
-- 新用户首单优惠
('WELCOME20', '新用户专享', '新用户首单立享8折优惠', 'percentage', 20, 100, 50, true, 'welcome', NOW(), NOW() + INTERVAL '1 year', NULL),
('FIRST50', '首单立减', '首次下单立减50元', 'fixed', 50, 200, NULL, true, 'welcome', NOW(), NOW() + INTERVAL '1 year', NULL),

-- 节日促销
('SPRING2024', '春季焕新', '春季护肤节，全场85折', 'percentage', 15, 150, 100, false, 'holiday', NOW(), NOW() + INTERVAL '30 days', 1000),
('BEAUTY520', '520美丽节', '520特惠，满300减60', 'fixed', 60, 300, NULL, false, 'holiday', NOW(), NOW() + INTERVAL '7 days', 500),
('SUMMER25', '夏日清凉', '夏季防晒季，防晒产品75折', 'percentage', 25, 100, 80, false, 'holiday', NOW(), NOW() + INTERVAL '60 days', 800),

-- 常规优惠
('SAVE10', '常规优惠', '全场9折优惠券', 'percentage', 10, 50, 30, false, 'general', NOW(), NOW() + INTERVAL '90 days', 2000),
('FREE100', '满减优惠', '满500减100', 'fixed', 100, 500, NULL, false, 'general', NOW(), NOW() + INTERVAL '60 days', 1500),

-- VIP专属
('VIP30', 'VIP专享', 'VIP会员专享7折优惠', 'percentage', 30, 200, 150, false, 'vip', NOW(), NOW() + INTERVAL '180 days', NULL),

-- 生日优惠
('BIRTHDAY', '生日礼遇', '生日月专属8折优惠', 'percentage', 20, 0, 100, false, 'birthday', NOW(), NOW() + INTERVAL '365 days', NULL),

-- 推荐奖励
('REFER30', '推荐好礼', '成功推荐好友，双方各得30元', 'fixed', 30, 100, NULL, false, 'referral', NOW(), NOW() + INTERVAL '365 days', NULL)

ON CONFLICT (code) DO NOTHING;
