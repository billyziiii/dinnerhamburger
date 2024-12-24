import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Animated, ScrollView } from 'react-native';
import { useState, useRef, useEffect } from 'react';

const INGREDIENTS = {
  budget: {
    title: '預算',
    options: [
      { id: 'cheap', text: '平價', emoji: '💰' },
      { id: 'medium', text: '中等', emoji: '💰💰' },
      { id: 'expensive', text: '高級', emoji: '💰💰💰' }
    ]
  },
  cuisine: {
    title: '料理',
    options: [
      { id: 'chinese', text: '中式', emoji: '🥢' },
      { id: 'japanese', text: '日式', emoji: '🍱' },
      { id: 'western', text: '西式', emoji: '🍴' }
    ]
  },
  taste: {
    title: '口味',
    options: [
      { id: 'spicy', text: '重口味/辣', emoji: '🌶️' },
      { id: 'sweet', text: '甜', emoji: '🍯' },
      { id: 'light', text: '清淡', emoji: '🥗' },
      { id: 'savory', text: '鹹香', emoji: '🧂' }
    ],
    skippable: true
  },
  temperature: {
    title: '溫度',
    options: [
      { id: 'hot', text: '熱食', emoji: '♨️' },
      { id: 'cold', text: '冷食', emoji: '❄️' }
    ]
  }
};

const FOOD_RECOMMENDATIONS = {
  chinese: {
    cheap: {
      hot: {
        spicy: ['麻辣燙', '重慶小麵', '川味牛肉麵', '麻婆豆腐', '水煮魚片', '辣子雞丁', '麻辣香鍋', '酸辣粉'],
        sweet: ['糖醋里肌', '甜燒肉', '叉燒飯', '蜜汁叉燒', '東坡肉', '紅燒肉', '糖醋排骨'],
        light: ['陽春麵', '清粥小菜', '白切雞飯', '蒸餃', '清燉牛肉麵', '青菜豆腐湯', '絲瓜蛤蜊'],
        savory: ['燒鴨飯', '油雞飯', '滷肉飯', '蔥油拌麵', '榨菜肉絲麵', '炸醬麵', '三杯雞']
      },
      cold: {
        spicy: ['涼皮', '口水雞', '麻辣海帶', '夫妻肺片', '涼拌黃瓜', '涼拌木耳'],
        sweet: ['涼糕', '甜豆花', '愛玉', '仙草凍', '粉粿', '豆花'],
        light: ['小黃瓜', '涼拌豆腐', '涼拌海帶', '涼拌三絲', '豆花'],
        savory: ['小菜拼盤', '滷味拼盤', '涼拌雞絲', '涼拌海蜇', '皮蛋豆腐']
      }
    },
    medium: {
      hot: {
        spicy: ['麻辣火鍋', '水煮牛肉', '麻辣香鍋', '重慶火鍋', '四川麻辣燙', '辣子雞', '麻辣燙'],
        sweet: ['蜜汁叉燒', '東坡肉', '糖醋魚', '京醬肉絲', '蜜汁雞翅', '糖醋排骨'],
        light: ['砂鍋魚頭', '清蒸魚', '菜心炒蝦仁', '蒸龍蝦', '清蒸螃蟹', '白灼蝦'],
        savory: ['北京烤鴨', '獅子頭', '紅燒獅子頭', '蔥爆牛肉', '九層塔炒蛤蜊', '薑蔥龍蝦']
      },
      cold: {
        spicy: ['夫妻肺片', '棒棒雞', '麻辣鴨血', '涼拌海鮮', '麻辣豬耳'],
        sweet: ['芋圓', '杏仁豆腐', '芒果布丁', '豆花', '愛玉'],
        light: ['涼拌海鮮', '白切雞', '手撕雞', '涼拌三絲', '涼拌海蜇'],
        savory: ['鹽水鴨', '醉雞', '五香牛肉', '滷味拼盤', '燻雞']
      }
    },
    expensive: {
      hot: {
        spicy: ['帝王蟹火鍋', '龍蝦麻辣香鍋', '魚子醬麻婆豆腐', '和牛麻辣鍋', '乾鍋和牛'],
        sweet: ['蜜汁叉燒拼盤', '蓮藕排骨湯', '佛跳牆', '東坡肉套餐', '蜜汁和牛'],
        light: ['清蒸大龍蝦', '魚翅羹', '蟹黃豆腐', '清蒸大閘蟹', '清蒸龍蝦'],
        savory: ['北京烤鴨全鴨宴', '乾隆佛跳牆', '蔘鬚燉雞', '蟹粉獅子頭', '松露炒飯']
      },
      cold: {
        spicy: ['頂級夫妻肺片', '帝王蟹沙拉', '龍蝦冷盤', '和牛生牛肉'],
        sweet: ['燕窩杏仁豆腐', '人蔘愛玉', '桃膠雪燕', '冰糖燕窩'],
        light: ['海鮮冷盤', '魚子醬冷盤', '清蒸大閘蟹'],
        savory: ['頂級燻雞', '醉蟹', '五香和牛肉', '龍蝦沙拉']
      }
    }
  },
  japanese: {
    cheap: {
      hot: {
        spicy: ['咖哩飯', '辣味拉麵', '辣炒烏龍麵', '辛味噌拉麵', '地獄拉麵', '辣味豚骨拉麵'],
        sweet: ['豬排丼', '親子丼', '天婦羅丼', '蛋包飯', '關東煮', '味噌湯'],
        light: ['烏龍麵', '蕎麥麵', '清湯拉麵', '茶泡飯', '味噌湯', '蒸蛋'],
        savory: ['豬肉蓋飯', '炒麵', '關東煮', '豚骨拉麵', '鹽味拉麵', '炸豬排']
      },
      cold: {
        spicy: ['辣味冷麵', '辣味沾麵', '辣味涼拌豆腐'],
        sweet: ['甜味冷烏龍', '水果沙拉', '日式果凍'],
        light: ['冷麵', '涼拌蕎麥麵', '豆腐沙拉', '涼拌海藻', '小菜拼盤'],
        savory: ['飯糰', '壽司卷', '涼拌豆腐', '生魚片', '冷沾麵']
      }
    },
    medium: {
      hot: {
        spicy: ['地獄拉麵', '辣味沾麵', '辣味壽喜燒', '辣味豚骨拉麵', '咖哩豬排'],
        sweet: ['蒲燒鰻魚飯', '天丼', '炸豬排咖哩', '親子丼套餐', '天婦羅定食'],
        light: ['壽喜燒', '火鍋', '豆腐鍋', '清湯火鍋', '涮涮鍋'],
        savory: ['燒肉定食', '海鮮丼', '天婦羅定食', '豚骨拉麵', '生魚片定食']
      },
      cold: {
        spicy: ['辣味冷沾麵', '辣味冷麵', '辣味壽司'],
        sweet: ['水果刨冰', '抹茶冰品', '水果沙拉'],
        light: ['生魚片', '散壽司', '冷烏龍麵', '蕎麥冷麵', '豆腐沙拉'],
        savory: ['刺身定食', '海鮮散壽司', '冷沾麵', '海鮮冷盤', '生魚片拼盤']
      }
    },
    expensive: {
      hot: {
        spicy: ['和牛咖哩', '高級地獄拉麵', '和牛壽喜燒', '龍蝦味噌湯', '松露拉麵'],
        sweet: ['特上鰻魚飯', '和牛丼', 'A5和牛燒肉', '豪華天丼', '特選壽喜燒'],
        light: ['懷石料理', '河豚料理', '特上天婦羅', '龍蝦味噌湯', '松露茶碗蒸'],
        savory: ['頂級刺身拼盤', '帝王蟹火鍋', '和牛燒肉', '特選壽司套餐', '龍蝦天婦羅']
      },
      cold: {
        spicy: ['特選辣味冷麵', '頂級辣味沾麵', '和牛韃靼'],
        sweet: ['特製水果刨冰', '高級抹茶凍', '季節水果拼盤'],
        light: ['特選刺身', '高級散壽司', '頂級冷麵'],
        savory: ['特上生魚片', '頂級海鮮冷盤', '和牛生魚片']
      }
    }
  },
  western: {
    cheap: {
      hot: {
        spicy: ['辣味炸雞', '辣味薯條', '墨西哥辣餅', '辣味漢堡', '辣味義大利麵'],
        sweet: ['鬆餅', '法式吐司', '肉桂捲', '奶油培根義大利麵', '焗烤通心粉'],
        light: ['義大利麵', '通心粉', '濃湯', '清炒蔬菜', '烤雞沙拉'],
        savory: ['漢堡', '熱狗', '薯條', '起司三明治', '培根蛋三明治']
      },
      cold: {
        spicy: ['辣味沙拉', '辣味三明治', '辣雞沙拉'],
        sweet: ['水果優格', '甜甜圈', '冰淇淋'],
        light: ['生菜沙拉', '水果優格', '三明治', '優格水果杯', '蔬菜沙拉'],
        savory: ['起司三明治', '雞肉沙拉', '鮪魚三明治', '火腿三明治', '蛋沙拉三明治']
      }
    },
    medium: {
      hot: {
        spicy: ['辣味雞翅', '墨西哥捲餅', '辣味義大利麵', '辣味披薩', '辣味燉飯'],
        sweet: ['焗烤蘋果派', '法式甜點', '提拉米蘇', '奶油燉飯', '焦糖布丁'],
        light: ['燉飯', '海鮮義大利麵', '蘑菇湯', '烤雞', '清炒時蔬'],
        savory: ['牛排', '烤雞', '豬排', '焗烤義大利麵', '海鮮燉飯']
      },
      cold: {
        spicy: ['辣味凱薩沙拉', '辣味雞肉沙拉', '墨西哥生菜捲'],
        sweet: ['水果聖代', '冰淇淋聖代', '巧克力慕斯'],
        light: ['凱薩沙拉', '水果沙拉', '優格沙拉', '地中海沙拉'],
        savory: ['生菜沙拉佐牛排', '雞肉凱薩沙拉', '煙燻鮭魚沙拉', '帕尼尼']
      }
    },
    expensive: {
      hot: {
        spicy: ['辣味龍蝦', '辣味和牛排', '辣味海鮮燉飯', '松露辣味義大利麵'],
        sweet: ['法式甜點拼盤', '焦糖布丁', '巧克力熔岩蛋糕', '松露燉飯'],
        light: ['龍蝦義大利麵', '松露燉飯', '法式海鮮湯', '清蒸龍蝦'],
        savory: ['和牛牛排', '龍蝦', '羊排', '松露義大利麵', '海鮮燉飯']
      },
      cold: {
        spicy: ['辣味龍蝦沙拉', '辣味和牛生肉', '辣味海鮮沙拉'],
        sweet: ['高級甜點拼盤', '法式馬卡龍', '水果冰淇淋'],
        light: ['頂級海鮮沙拉', '和牛生肉片', '龍蝦沙拉'],
        savory: ['和牛塔塔', '龍蝦沙拉', '海鮮冷盤', '魚子醬前菜']
      }
    }
  }
};

const THEME = {
  primary: '#FF6B6B',
  background: '#2D3748',
  surface: '#2D3748',
  text: '#E2E8F0',
  textSecondary: '#A0AEC0',
  success: '#48BB78',
  ingredients: {
    budget: '#2C5282',
    cuisine: '#285E61',
    taste: '#742A2A',
    temperature: '#322659',
    time: '#22543D',
    hongkong: '#2D3748'
  }
};

export default function App() {
  const [currentCategory, setCurrentCategory] = useState('budget');
  const [stack, setStack] = useState([]);
  const [recommendation, setRecommendation] = useState(null);
  const stackAnim = useRef(new Animated.Value(0)).current;

  const addToStack = (item) => {
    if (stack.length >= 4) {
      return;
    }

    const hasSameCategory = stack.some(
      stackItem => stackItem.category === currentCategory
    );

    if (!hasSameCategory) {
      const updatedStack = [...stack, { ...item, category: currentCategory }];
      setStack(updatedStack);
      
      if (updatedStack.length === 4) {
        generateRecommendation(updatedStack);
      } else {
        const nextCategory = getNextCategory(currentCategory);
        if (nextCategory) {
          setCurrentCategory(nextCategory);
        }
      }
    }
  };

  const generateRecommendation = (finalStack) => {
    const budget = finalStack.find(item => item.category === 'budget')?.id || 'medium';
    const cuisine = finalStack.find(item => item.category === 'cuisine')?.id || 'chinese';
    const taste = finalStack.find(item => item.category === 'taste')?.id || 'savory';
    const temperature = finalStack.find(item => item.category === 'temperature')?.id || 'hot';

    try {
      // 获取当前选择的所有可用推荐
      const recommendations = [];
      
      // 1. 添加完全匹配的推荐
      if (FOOD_RECOMMENDATIONS[cuisine]?.[budget]?.[temperature]?.[taste]) {
        recommendations.push(...FOOD_RECOMMENDATIONS[cuisine][budget][temperature][taste]);
      }
      
      // 2. 添加相同价位、温度下的其他口味推荐（权重较低）
      const otherTastes = Object.keys(FOOD_RECOMMENDATIONS[cuisine]?.[budget]?.[temperature] || {})
        .filter(t => t !== taste);
      
      for (const otherTaste of otherTastes) {
        const otherTasteRecs = FOOD_RECOMMENDATIONS[cuisine][budget][temperature][otherTaste];
        if (otherTasteRecs) {
          // 随机选择2个其他口味的推荐
          const randomRecs = otherTasteRecs.sort(() => 0.5 - Math.random()).slice(0, 2);
          recommendations.push(...randomRecs);
        }
      }
      
      // 3. 如果推荐数量太少，尝试添加相近价位的推荐
      if (recommendations.length < 5) {
        const alternateBudget = budget === 'expensive' ? 'medium' : 
                               budget === 'cheap' ? 'medium' : 'cheap';
        
        if (FOOD_RECOMMENDATIONS[cuisine]?.[alternateBudget]?.[temperature]?.[taste]) {
          const altRecs = FOOD_RECOMMENDATIONS[cuisine][alternateBudget][temperature][taste];
          // 随机选择3个相近价位的推荐
          const randomAltRecs = altRecs.sort(() => 0.5 - Math.random()).slice(0, 3);
          recommendations.push(...randomAltRecs);
        }
      }

      // 4. 确保至少有一个推荐
      if (recommendations.length === 0) {
        // 使用默认推荐
        const defaultRecs = {
          chinese: ['經典炒飯', '清燉牛肉麵', '宮保雞丁'],
          japanese: ['豚骨拉麵', '親子丼', '天婦羅'],
          western: ['義大利麵', '漢堡排', '凱薩沙拉']
        };
        recommendations.push(...(defaultRecs[cuisine] || defaultRecs.chinese));
      }

      // 5. 从所有推荐中随机选择一个
      const randomIndex = Math.floor(Math.random() * recommendations.length);
      const selectedRecommendation = recommendations[randomIndex];

      // 6. 添加一些有趣的描述
      const descriptions = {
        spicy: ['香辣可口的', '麻辣鮮香的', '辛香夠味的', '重口味的'],
        sweet: ['甜而不膩的', '蜜香四溢的', '香甜可口的', '溫潤甘甜的'],
        light: ['清爽宜人的', '清淡養生的', '清新可口的', '輕盈爽口的'],
        savory: ['鮮美可口的', '香氣四溢的', '鹹香夠味的', '層次豐富的']
      };
      
      const tempDesc = {
        hot: ['熱騰騰', '暖呼呼'],
        cold: ['清涼爽口', '冰涼可口']
      };

      const randomDesc = descriptions[taste][Math.floor(Math.random() * descriptions[taste].length)];
      const randomTempDesc = tempDesc[temperature][Math.floor(Math.random() * tempDesc[temperature].length)];
      
      setRecommendation(`${randomDesc}${randomTempDesc}${selectedRecommendation}`);
    } catch (error) {
      console.error('推薦生成錯誤:', error);
      setRecommendation('抱歉，推薦系統出現錯誤，請重新選擇');
    }
  };

  const getNextCategory = (current) => {
    const categories = Object.keys(INGREDIENTS);
    const currentIndex = categories.indexOf(current);
    return categories[currentIndex + 1];
  };

  const resetStack = () => {
    setStack([]);
    setCurrentCategory('budget');
    setRecommendation(null);
    stackAnim.setValue(0);
  };

  const renderBurger = () => {
    const centerY = 125; // 容器高度的一半
    const itemHeight = 40;
    const spacing = 5;
    const totalHeight = (stack.length + 2) * itemHeight + (stack.length + 1) * spacing;
    const startY = centerY - totalHeight / 2;

    return (
      <View style={styles.burgerContainer}>
        <View style={[
          styles.breadTop,
          {
            top: startY
          }
        ]} />
        {stack.map((item, index) => {
          const itemY = startY + itemHeight + spacing + (index * (itemHeight + spacing));
          return (
            <Animated.View
              key={index}
              style={[
                styles.ingredient,
                {
                  backgroundColor: THEME.ingredients[item.category],
                  top: itemY,
                }
              ]}
            >
              <Text style={styles.ingredientText}>
                {item.emoji} {item.text}
              </Text>
            </Animated.View>
          );
        })}
        <View style={[
          styles.breadBottom,
          {
            top: startY + totalHeight - itemHeight
          }
        ]} />
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: THEME.background,
      paddingTop: 40,
    },
    burgerContainer: {
      height: 250,
      width: '100%',
      position: 'relative',
      marginVertical: 10,
    },
    breadTop: {
      position: 'absolute',
      width: 200,
      height: 40,
      backgroundColor: '#744210',
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      left: '50%',
      marginLeft: -100,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      zIndex: 1,
    },
    breadBottom: {
      position: 'absolute',
      width: 200,
      height: 40,
      backgroundColor: '#744210',
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
      left: '50%',
      marginLeft: -100,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      zIndex: 1,
    },
    ingredient: {
      position: 'absolute',
      width: 180,
      height: 40,
      backgroundColor: THEME.surface,
      borderRadius: 15,
      left: '50%',
      marginLeft: -90,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      zIndex: 2,
    },
    ingredientText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
    optionsContainer: {
      flex: 1,
      padding: 15,
      justifyContent: 'flex-start',
    },
    categoryTitle: {
      fontSize: 20,
      marginBottom: 15,
      color: THEME.text,
      fontWeight: '600',
      textAlign: 'center',
    },
    optionButton: {
      backgroundColor: '#1A202C',
      padding: 15,
      marginBottom: 10,
      borderRadius: 15,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    optionText: {
      fontSize: 18,
      color: THEME.text,
      textAlign: 'center',
      fontWeight: '500',
    },
    skipButton: {
      backgroundColor: THEME.surface,
      opacity: 0.8,
    },
    skipButtonText: {
      color: THEME.textSecondary,
    },
    recommendationContainer: {
      backgroundColor: '#1A202C',
      borderRadius: 20,
      padding: 20,
      margin: 15,
      alignItems: 'center',
      justifyContent: 'center',
    },
    recommendationTitle: {
      fontSize: 24,
      marginBottom: 15,
      color: THEME.text,
      fontWeight: '600',
    },
    recommendationText: {
      fontSize: 32,
      color: THEME.primary,
      marginBottom: 20,
      fontWeight: 'bold',
    },
    resetButton: {
      backgroundColor: THEME.primary,
      padding: 15,
      width: '100%',
      borderRadius: 15,
      marginTop: 10,
    },
    resetButtonText: {
      fontSize: 18,
      color: '#FFF',
      textAlign: 'center',
      fontWeight: '600',
    },
  });

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      {renderBurger()}
      <View style={styles.optionsContainer}>
        {recommendation ? (
          <View style={styles.recommendationContainer}>
            <Text style={styles.recommendationTitle}>推薦您吃：</Text>
            <Text style={styles.recommendationText}>{recommendation}</Text>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={resetStack}
            >
              <Text style={styles.resetButtonText}>重新選擇</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={styles.categoryTitle}>
              {INGREDIENTS[currentCategory].title}
            </Text>
            <ScrollView>
              {INGREDIENTS[currentCategory].options.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={styles.optionButton}
                  onPress={() => addToStack({ ...option, category: currentCategory })}
                >
                  <Text style={styles.optionText}>
                    {option.emoji} {option.text}
                  </Text>
                </TouchableOpacity>
              ))}
              {INGREDIENTS[currentCategory].skippable && (
                <TouchableOpacity
                  style={[styles.optionButton, styles.skipButton]}
                  onPress={() => {
                    const nextCategory = getNextCategory(currentCategory);
                    if (nextCategory) {
                      setCurrentCategory(nextCategory);
                    }
                  }}
                >
                  <Text style={[styles.optionText, styles.skipButtonText]}>
                    跳過
                  </Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </>
        )}
      </View>
    </View>
  );
}